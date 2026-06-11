import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
// On GitHub Actions, GITHUB_REPOSITORY is "owner/repo" — derive the Pages
// base path ("/repo/") from it automatically so it always matches the repo
// name (e.g. /Manifest-app/). Locally it stays "/".
const ghRepo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: ghRepo ? `/${ghRepo}/` : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
