import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      // Gate the pure-logic layer only. Without an explicit include, coverage
      // instruments whatever a test happens to import, so adding one component
      // test would silently drag its entire TSX import graph into the
      // denominator and fail the thresholds below for no real reason.
      include: [
        'scripts/**/*.ts',
        'src/lib/**/*.ts',
        'src/utils/**/*.ts',
        'src/data/**/*.ts'
      ],
      exclude: [
        '**/*.tsx',
        'node_modules/**',
        '**/*.config.*',
        '**/dist/**',
        '**/.next/**',
        '**/out/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
