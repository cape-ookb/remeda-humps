import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { basicObj, basicRes } from './mock'

// Exercises the built CommonJS output (lib/*.cjs), which the ESM-based test
// suite otherwise never touches. Skipped when `lib/` is absent (no build yet),
// so a fresh checkout's `npm test` stays green without forcing a build.
const require = createRequire(import.meta.url)
const built = existsSync(fileURLToPath(new URL('../lib/index.cjs', import.meta.url)))

describe.skipIf(!built)('CommonJS build', () => {
  it('require() returns the humps function directly', () => {
    const humps = require('../lib/index.cjs')
    expect(typeof humps).toBe('function')
    expect(humps(basicObj)).toEqual(basicRes)
  })

  it('require() returns the createHumps factory directly', () => {
    const createHumps = require('../lib/createHumps.cjs')
    expect(typeof createHumps).toBe('function')
    const camel = createHumps((key: string) => key.toUpperCase())
    expect(camel({ a: 1 })).toEqual({ A: 1 })
  })
})
