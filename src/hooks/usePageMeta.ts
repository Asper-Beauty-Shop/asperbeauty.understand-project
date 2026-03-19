import { useEffect } from "react";

interface PageMetaOptions {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

export function usePageMeta({ title, description, image, canonical, type, jsonLd }: PageMetaOptions) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    if (title) {
      setMeta("og:title", title, "property");
    }
    if (image) {
      setMeta("og:image", image, "property");
    }
    if (type) {
      setMeta("og:type", type, "property");
    }
    if (canonical) {
      const base = "https://www.asperbeautyshop.com";
      const url = canonical.startsWith("http") ? canonical : `${base}${canonical}`;
      setMeta("og:url", url, "property");
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = url;
    }

    // JSON-LD structured data
    const scriptId = "page-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, image, canonical, type, jsonLd]);
}
