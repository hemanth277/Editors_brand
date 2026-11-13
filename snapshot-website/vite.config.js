import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library
          'vendor-motion': ['framer-motion'],
          // Supabase client
          'vendor-supabase': ['@supabase/supabase-js'],
          // Icons
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
