// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',            // ✅ custom domain = root
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
});
