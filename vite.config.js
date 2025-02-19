import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfill';

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['path', 'stream', 'util', 'crypto'],
      exclude: ['http'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      overrides: {
        fs: 'memfs',
      },
      protocolImports: true,
    }),
  ],
});
