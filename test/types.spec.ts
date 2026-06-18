import { describe, expectTypeOf, it } from 'vitest'
import humps from '../src'
import createHumps, { type Humps, type KeyConverter } from '../src/createHumps'

interface ApiUser {
  first_name: string
  last_name: string
}

interface User {
  firstName: string
  lastName: string
}

describe('types', () => {
  it('preserves the annotated output type', () => {
    const user = humps<User>({ first_name: 'Ada', last_name: 'Lovelace' } as ApiUser)
    expectTypeOf(user).toEqualTypeOf<User>()
  })

  it('infers the input type when no type argument is given', () => {
    expectTypeOf(humps({ a: 1 })).toEqualTypeOf<{ a: number }>()
  })

  it('exposes createHumps as a Humps factory', () => {
    expectTypeOf(createHumps).parameters.toEqualTypeOf<[KeyConverter]>()
    expectTypeOf(createHumps((key) => key)).toEqualTypeOf<Humps>()
  })

  it('types KeyConverter as (key: string) => string', () => {
    expectTypeOf<KeyConverter>().toEqualTypeOf<(key: string) => string>()
  })
})
