/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ELEVEN_LABS_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
