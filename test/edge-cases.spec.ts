import { describe, expect, it } from 'vitest'
import { toKebabCase, toSnakeCase } from 'remeda'
import humps from '../src'
import createHumps from '../src/createHumps'

describe('humps – pass-through values', () => {
  it.each([
    ['string', 'some string_yo'],
    ['number', 42],
    ['boolean', true],
    ['null', null],
    ['undefined', undefined],
  ])('returns a top-level %s untouched', (_label, value) => {
    expect(humps(value)).toBe(value)
  })

  it('returns a top-level function by reference', () => {
    const fn = (): void => {}
    expect(humps(fn)).toBe(fn)
  })

  it('keeps null, undefined and function values inside objects', () => {
    const fn = (): void => {}
    const result = humps<{ aNull: null; anUndef: undefined; aFn: () => void }>({
      a_null: null,
      an_undef: undefined,
      a_fn: fn,
    })
    expect(result).toEqual({ aNull: null, anUndef: undefined, aFn: fn })
    // The key is kept even though the value is undefined.
    expect('anUndef' in result).toBe(true)
    // Functions are preserved by reference, not cloned/converted.
    expect(result.aFn).toBe(fn)
  })
})

describe('humps – non-plain objects are not converted', () => {
  it('leaves class instance keys alone and preserves the reference', () => {
    class Box {
      readonly snake_value = 1
    }
    const instance = new Box()
    const result = humps<{ boxVal: Box }>({ box_val: instance })

    expect(result.boxVal).toBe(instance)
    expect(Object.keys(result.boxVal)).toEqual(['snake_value'])
  })

  it('preserves Date values by reference', () => {
    const date = new Date('2020-01-01T00:00:00.000Z')
    const result = humps<{ createdAt: Date }>({ created_at: date })

    expect(result.createdAt).toBe(date)
    expect(result.createdAt instanceof Date).toBe(true)
  })

  it('returns a class instance passed as the root untouched', () => {
    class Box {
      readonly snake_value = 1
    }
    const instance = new Box()
    expect(humps(instance)).toBe(instance)
  })
})

describe('humps – nesting and arrays', () => {
  it('converts deeply nested object keys', () => {
    const input = { level_one: { level_two: { level_three: 'deep' } } }
    expect(humps(input)).toEqual({ levelOne: { levelTwo: { levelThree: 'deep' } } })
  })

  it('handles mixed arrays of objects, primitives and nested arrays', () => {
    const input = { my_list: [{ inner_key: 1 }, 2, 'three', [{ deep_key: 4 }]] }
    expect(humps(input)).toEqual({
      myList: [{ innerKey: 1 }, 2, 'three', [{ deepKey: 4 }]],
    })
  })

  it('converts a top-level array of objects', () => {
    const input = [{ attr_one: 'foo' }, { attr_one: 'bar' }]
    expect(humps(input)).toEqual([{ attrOne: 'foo' }, { attrOne: 'bar' }])
  })

  it('returns empty objects and arrays unchanged in value', () => {
    expect(humps({})).toEqual({})
    expect(humps([])).toEqual([])
  })

  it('leaves already-camelCased keys as-is', () => {
    const input = { alreadyCamel: { stillCamel: 1 } }
    expect(humps(input)).toEqual({ alreadyCamel: { stillCamel: 1 } })
  })
})

describe('humps – immutability', () => {
  it('returns a new object and does not mutate the input', () => {
    const input = { attr_one: 'foo', nested: { attr_two: 'bar' } }
    const result = humps<{ attrOne: string; nested: { attrTwo: string } }>(input)

    expect(result).not.toBe(input)
    expect(result.nested).not.toBe(input.nested)
    // Original is untouched.
    expect(input).toEqual({ attr_one: 'foo', nested: { attr_two: 'bar' } })
  })
})

describe('createHumps – custom converters', () => {
  it('round-trips camelCase -> snake_case', () => {
    const snakes = createHumps((key) => toSnakeCase(key))
    expect(snakes({ attrOne: 'foo', attrTwo: { nestedKey: 'bar' } })).toEqual({
      attr_one: 'foo',
      attr_two: { nested_key: 'bar' },
    })
  })

  it('supports kebab-case conversion', () => {
    const kebabs = createHumps((key) => toKebabCase(key))
    expect(kebabs({ attrOne: { nestedKey: 1 } })).toEqual({
      'attr-one': { 'nested-key': 1 },
    })
  })

  it('uses an arbitrary converter (constant key)', () => {
    const shout = createHumps(() => 'X')
    // Every key collapses to the same name; last write wins per object.
    expect(shout({ a: 1, b: 2 })).toEqual({ X: 2 })
  })

  it('applies the identity converter without changing keys', () => {
    const identity = createHumps((key) => key)
    expect(identity({ snake_key: { another_one: 1 } })).toEqual({
      snake_key: { another_one: 1 },
    })
  })
})
