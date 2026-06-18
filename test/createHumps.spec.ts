import { describe, expect, it } from 'vitest'
import { toCamelCase, toSnakeCase } from 'remeda'
import createHumps from '../src/createHumps'
import { basicObj, basicRes } from './mock'

const humps = createHumps((key) => toCamelCase(key))
const snakes = createHumps((key) => toSnakeCase(key))

describe('createHumps', () => {
  it('camelCases keys with the supplied converter', () => {
    expect(humps(basicObj)).toEqual(basicRes)
  })

  it('round-trips back to snake_case with a custom converter', () => {
    expect(snakes(basicRes)).toEqual(basicObj)
  })
})
