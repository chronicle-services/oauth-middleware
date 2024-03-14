import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  const baseConfig = {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    port: process.env.SERVER__VITE__PORT ?? 5173
  };

  if(command == 'build'){
    baseConfig.base='/static/views/app'
  }

  return baseConfig;
})
