import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      entities: path.resolve(__dirname, 'src/entities'),
      pages: path.resolve(__dirname, 'src/pages'),
      features: path.resolve(__dirname, 'src/features'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      shared: path.resolve(__dirname, 'src/shared'),
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
})
