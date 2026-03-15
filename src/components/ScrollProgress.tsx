import { useEffect, useRef } from "react";

/**
 * Gold scroll-progress bar — "The Midas Touch."
 * Renders a thin gold line at the very top of the viewport
 * indicating how far the user has scrolled.
 *
 * DOM writes go directly to the element ref — no React state, no re-renders.
 * RAF throttles reads to one per animation frame (prevents layout thrashing).
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = 0;
        const el = document.documentElement;
        const scrollable = el.scrollHeight - el.clientHeight;
        if (!barRef.current || scrollable <= 0) return;
        const pct = (el.scrollTop / scrollable) * 100;
        barRef.current.style.width = `${pct}%`;
        barRef.current.style.opacity = pct > 0 ? "1" : "0";
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="scroll-progress"
      style={{ width: "0%", opacity: 0 }}
    />
  );
}

