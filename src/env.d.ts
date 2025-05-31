/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_SOCKET_URL: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 