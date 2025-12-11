import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/__tests__/**/*.{test,spec}.ts'],
    exclude: ['tests/e2e/**', 'playwright.config.ts', '**/node_modules/**']
  }
});
