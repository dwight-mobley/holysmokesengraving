import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});