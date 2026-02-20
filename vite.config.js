import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/uzlang/',
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/sql.js')) {
            return 'vendor-sqljs';
          }
          if (
            id.includes('node_modules/@mui') ||
            id.includes('node_modules/@emotion') ||
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor-ui';
          }
        }
      }
    }
  }
});
