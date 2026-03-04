/// <reference types="vite/client" />

/** Production: Lovable main site. Supabase project qqceibvalkoytafynwoc. */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SHOPIFY_STORE_DOMAIN: string;
  readonly VITE_SHOPIFY_STOREFRONT_TOKEN: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_SHOPIFY_API_VERSION?: string;
  readonly VITE_SUPABASE_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
