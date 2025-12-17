import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // For GitHub Pages deployment, uncomment and set your repo name:
  // base: '/your-repo-name/',

  build: {
    // Target modern browsers for smaller bundles
    target: 'esnext',

    // Enable minification
    minify: 'esbuild',

    // Generate source maps for debugging (disable in production if not needed)
    sourcemap: false,

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Three.js and related libraries
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Separate Framer Motion
          framer: ['framer-motion'],
          // React core
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },

    // Warn if chunks are too large
    chunkSizeWarningLimit: 500,
  },

  // Enable compression in preview mode
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
})
