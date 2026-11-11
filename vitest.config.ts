import { configDefaults, defineConfig } from 'vitest/config'

// CI_TEST_PROFILE=pr (set by the CI test stage on pull requests) skips *.slow.test.* files.
const pr = process.env.CI_TEST_PROFILE === 'pr'

export default defineConfig({
  test: {
    include: ['registry/**/*.test.ts', 'scripts/**/*.test.mjs'],
    exclude: [...configDefaults.exclude, ...(pr ? ['**/*.slow.test.*'] : [])],
    // Report tests slower than 2 s; the default 5 s timeout stays.
    slowTestThreshold: 2_000,
  },
})
