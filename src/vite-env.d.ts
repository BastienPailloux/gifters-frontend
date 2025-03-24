/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BREVO_LIST_ID: string;
  // Ajouter d'autres variables d'environnement au besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
