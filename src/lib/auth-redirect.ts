const STORAGE_KEY = "asper_auth_return_to";

/**
 * Save the current path so we can redirect back after login.
 * Skips saving if already on /auth or /account.
 */
export function saveReturnPath(path?: string) {
  const current = path ?? window.location.pathname + window.location.search;
  const skip = ["/auth", "/account"];
  if (skip.some((s) => current.startsWith(s))) return;
  sessionStorage.setItem(STORAGE_KEY, current);
}

/**
 * Pop the saved return path (returns it and clears storage).
 * Falls back to /account if nothing was saved.
 */
export function popReturnPath(): string {
  const saved = sessionStorage.getItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  return saved || "/account";
}

/**
 * Build the OAuth redirect URL using the saved return path.
 */
export function getOAuthRedirectUrl(): string {
  const returnTo = sessionStorage.getItem(STORAGE_KEY);
  return `${window.location.origin}${returnTo || "/account"}`;
}
