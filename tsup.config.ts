import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/createHumps.ts'],
  format: ['esm', 'cjs'],
  outDir: 'lib',
  dts: true,
  clean: true,
  splitting: true,
  // Make `require('remeda-humps')` return the default export directly, the way
  // the old babel `add-module-exports` plugin did.
  cjsInterop: true,
})
