import { useEffect } from "react";

interface PageMetaOptions {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: "website" | "product";
  jsonLd?: object;
}

const BASE_URL = "https://www.asperbeautyshop.com";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * Sets page-level SEO meta tags dynamically.
 * Call at the top of any page component.
 */
export function usePageMeta({
  title,
  description,
  image = DEFAULT_IMAGE,
  canonical,
  type = "website",
  jsonLd,
}: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = title.includes("Asper") ? title : `${title} — Asper Beauty Shop`;
    document.title = fullTitle;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement("meta");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };

    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }

    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:image"]', "content", image);
    setMeta('meta[name="twitter:image"]', "content", image);

    if (canonical) {
      const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (link) link.href = `${BASE_URL}${canonical}`;
      setMeta('meta[property="og:url"]', "content", `${BASE_URL}${canonical}`);
    }

    // JSON-LD injection
    if (jsonLd) {
      const existing = document.getElementById("page-jsonld");
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.id = "page-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const existing = document.getElementById("page-jsonld");
      if (existing) existing.remove();
    };
  }, [title, description, image, canonical, type, jsonLd]);
}
