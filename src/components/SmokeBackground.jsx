export default function SmokeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Blob 1 — left side, large */}
      <div className="smoke-blob blob-1" />
      {/* Blob 2 — right side */}
      <div className="smoke-blob blob-2" />
      {/* Blob 3 — bottom center */}
      <div className="smoke-blob blob-3" />
      {/* Blob 4 — top right */}
      <div className="smoke-blob blob-4" />
    </div>
  );
}
