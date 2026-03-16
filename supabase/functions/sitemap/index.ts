import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://www.asperbeautyshop.com";

const STATIC_PAGES = [
  { path: "/",               changefreq: "daily",   priority: "1.0" },
  { path: "/shop",           changefreq: "daily",   priority: "0.9" },
  { path: "/brands",         changefreq: "weekly",  priority: "0.8" },
  { path: "/skin-concerns",  changefreq: "weekly",  priority: "0.8" },
  { path: "/best-sellers",   changefreq: "daily",   priority: "0.8" },
  { path: "/offers",         changefreq: "daily",   priority: "0.7" },
  { path: "/contact",        changefreq: "monthly", priority: "0.5" },
  { path: "/philosophy",     changefreq: "monthly", priority: "0.5" },
];

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Fetch all active product handles + updated_at
  const { data: products } = await supabase
    .from("products")
    .select("handle, updated_at")
    .neq("availability_status", "Pending_Purge")
    .not("handle", "is", null)
    .order("updated_at", { ascending: false });

  const now = new Date().toISOString().split("T")[0];

  const staticUrls = STATIC_PAGES.map(
    ({ path, changefreq, priority }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join("");

  const productUrls = (products ?? [])
    .filter((p) => p.handle)
    .map((p) => {
      const lastmod = p.updated_at
        ? p.updated_at.split("T")[0]
        : now;
      return `
  <url>
    <loc>${BASE_URL}/product/${p.handle}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${productUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
});
