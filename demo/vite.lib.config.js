import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': JSON.stringify({}),
    'process': JSON.stringify({ env: { NODE_ENV: 'production' } }),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/inject/lane-overview.jsx'),
      name: 'LaneOverview',
      fileName: 'lane-overview',
      formats: ['iife'],
    },
    outDir: 'public/js',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'lane-overview.bundle.js',
        assetFileNames: 'lane-overview.bundle.css',
      },
    },
  },
})
