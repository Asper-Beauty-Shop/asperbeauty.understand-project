/// <reference types="vite/client" />

declare module "*.md?raw" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_BEAUTY_ASSISTANT_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
