/**
 * Health check endpoint for monitoring (e.g. monitor-checklist).
 * Hit /health — response is 200 with body {"status":"ok"}.
 */
export default function Health() {
  return (
    <pre className="p-4 font-mono text-sm">
      {JSON.stringify({ status: "ok", ts: new Date().toISOString() }, null, 2)}
    </pre>
  );
}
