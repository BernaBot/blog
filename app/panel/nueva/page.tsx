import PanelForm from "@/components/PanelForm";

export default function NuevaEntrada() {
  return (
    <main className="min-h-screen bg-yeso">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="font-clinico text-xs text-tinta/50">PANEL</p>
        <h1 className="mb-8 font-display text-3xl text-tinta">Nueva entrada</h1>
        <PanelForm />
      </div>
    </main>
  );
}
