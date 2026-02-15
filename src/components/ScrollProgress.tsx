import { useState, useEffect, useCallback } from "react";

/**
 * Gold scroll-progress bar — "The Midas Touch."
 * Renders a thin gold line at the very top of the viewport
 * indicating how far the user has scrolled.
 */
export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollHeight <= 0) return;
    setWidth((scrollTop / scrollHeight) * 100);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (width <= 0) return null;

  return <div className="scroll-progress" style={{ width: `${width}%` }} />;
}
