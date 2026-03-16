import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px 50px 0px",
    triggerOnce = true,
  } = options;
  const ref = useRef<HTMLElement>(null);
  // Start visible (progressive enhancement) — content is shown by default
  // so that if IO never fires, users still see content
  const [isVisible, setIsVisible] = useState(true);
  const [hasObserver, setHasObserver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Only hide content once we know IO is working
    if (!hasObserver) {
      setIsVisible(false);
      setHasObserver(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasObserver]);

  return { ref, isVisible };
};
