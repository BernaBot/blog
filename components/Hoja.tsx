export default function Hoja({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pasillo">
      <div className="pasillo-escena" aria-hidden="true">
        <div className="pasillo-foto" />
      </div>
      <div className="pasillo-umbral" aria-hidden="true" />
      <div className="puerta">{children}</div>
    </div>
  );
}
