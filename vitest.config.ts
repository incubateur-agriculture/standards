import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ['**/__tests__/**'],
    coverage: {
        provider: 'istanbul',
        reporter: ['text', 'cobertura', 'lcovonly']
    },
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})