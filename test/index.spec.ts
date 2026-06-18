import { describe, expect, it } from 'vitest'
import humps from '../src'
import { basicObj, basicRes } from './mock'

const noop = (): void => {}

describe('humps', () => {
  it('does not process plain strings', () => {
    expect(humps('some string_yo')).toBe('some string_yo')
  })

  it('recursively camelCases object keys', () => {
    const before = {
      'space key': 'space',
      underscore_key: basicObj,
      TXT: 'ONE MORE THING',
      foo_bar: 'underscore',
      tests: 'ASTM D 4157-13',
      contents: ['100% Acrylic'],
      'dispatch-func': noop,
    }
    const after = {
      spaceKey: 'space',
      underscoreKey: basicRes,
      txt: 'ONE MORE THING',
      fooBar: 'underscore',
      tests: 'ASTM D 4157-13',
      contents: ['100% Acrylic'],
      dispatchFunc: noop,
    }
    expect(humps(before)).toEqual(after)
  })

  it('maps over arrays of objects', () => {
    const before = { foo_bar: 'underscore' }
    const after = { fooBar: 'underscore' }
    expect(humps([before, before])).toEqual([after, after])
  })

  it('preserves functions instead of converting them', () => {
    expect(humps(noop)).toBe(noop)
  })
})
