const fs = require("fs");

for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) continue;
  process.env[t.slice(0, i)] = t.slice(i + 1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = "devinsenibernabe@gmail.com";
const password = process.env.ADMIN_PASSWORD;
if (!url || !service || !password) {
  console.error("faltan variables");
  process.exit(1);
}

const headers = {
  apikey: service,
  Authorization: "Bearer " + service,
  "Content-Type": "application/json",
};

async function main() {
  const created = await fetch(url + "/auth/v1/admin/users", {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });
  let user = await created.json();
  if (!created.ok) {
    const listed = await fetch(
      url + "/auth/v1/admin/users?page=1&per_page=200",
      { headers }
    );
    const body = await listed.json();
    const existing = (body.users || []).find(
      (u) => (u.email || "").toLowerCase() === email
    );
    if (!existing) {
      console.error("no se pudo crear ni encontrar el usuario");
      console.error(created.status, JSON.stringify(user).slice(0, 200));
      process.exit(1);
    }
    const updated = await fetch(url + "/auth/v1/admin/users/" + existing.id, {
      method: "PUT",
      headers,
      body: JSON.stringify({ password, email_confirm: true }),
    });
    user = await updated.json();
    if (!updated.ok) {
      console.error("no se pudo actualizar la contraseña");
      process.exit(1);
    }
    console.log("usuario existente, contraseña actualizada");
  } else {
    console.log("usuario creado");
  }

  const id = user.id;
  const autor = await fetch(url + "/rest/v1/autores", {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: id }),
  });
  if (!autor.ok) {
    const t = await autor.text();
    if (!t.includes("duplicate")) {
      console.error("autores", autor.status, t.slice(0, 200));
      process.exit(1);
    }
  }
  console.log("autor vinculado");
  console.log("email", email);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
