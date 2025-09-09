import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:* https://api.example.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
    },
  },
  build: {
    // Security optimizations for production build
    minify: 'esbuild',
    // Performance optimizations
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Add content hash to filenames for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Manual chunk splitting for better performance
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('rsuite')) {
              return 'vendor-rsuite'
            }
            if (id.includes('@rsuite/icons')) {
              return 'vendor-icons'
            }
            // Other vendor libraries
            return 'vendor'
          }
          
          // Feature chunks
          if (id.includes('/src/components/')) {
            return 'components'
          }
          if (id.includes('/src/utils/')) {
            return 'utils'
          }
          if (id.includes('/src/validators/')) {
            return 'validators'
          }
          if (id.includes('/src/hooks/')) {
            return 'hooks'
          }
        },
      },
    },
  },
  define: {
    // Remove process.env from client bundle for security
    'process.env': '{}',
  },
})
