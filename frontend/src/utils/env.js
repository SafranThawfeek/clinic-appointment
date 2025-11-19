// Cross-environment API base helper
// This helper prefers CRA-style env vars (process.env.REACT_APP_API_URL).
// Avoids using `import.meta` directly so it won't cause parse errors in non-Vite setups.
export function getApiBase() {
  // Prefer React CRA env var if present (guard access to avoid ReferenceError in browsers)
  if (typeof process !== 'undefined' && process && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // Optional: allow a global shim (window.__env__) for custom setups or for Vite-like values injected at runtime
  try {
    if (typeof window !== "undefined" && window.__env && window.__env.VITE_API_URL) return window.__env.VITE_API_URL;
  } catch (e) {
    // ignore
  }

  // Last resort: localhost backend
  return 'http://localhost:5000';
}
