import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Accessibility: announces route changes to screen readers (live region).
 * Rendered off-screen (0 size) so it doesn't affect layout — similar to next-route-announcer.
 */
export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const message = pathname === "/" ? "Home" : pathname.slice(1).replace(/\//g, " ").replace(/-/g, " ") || "Page";
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, [pathname]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    />
  );
}
