import { isObjectType, isPlainObject } from 'remeda'

/**
 * A function that maps an object key to a new key, e.g. Remeda's
 * `toCamelCase` or `toSnakeCase`.
 */
export type KeyConverter = (key: string) => string

/**
 * Recursively walks a value and rewrites the keys of every plain object it
 * finds. Arrays are mapped over, plain objects have their keys converted, and
 * everything else (primitives, functions, class instances, dates, ...) is
 * returned untouched.
 *
 * Two call shapes:
 * - `humps(node)` infers the result type from the input — handy when the keys
 *   already match the type you have (or you'll cast afterwards).
 * - `humps<Output>(node)` lets you assert the converted shape you expect, since
 *   the runtime keys change but the structure stays the same.
 */
export interface Humps {
  <T>(node: T): T
  <TOutput>(node: unknown): TOutput
}

function humpsFactory(keyConverter: KeyConverter): (node: unknown) => unknown {
  function humps(node: unknown): unknown {
    if (Array.isArray(node)) return node.map(humps)

    if (isPlainObject(node)) {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(node)) {
        // Only recurse into object-like values (arrays + plain objects),
        // matching the original lodash `isObjectLike` behaviour. Functions,
        // primitives and `null` are preserved as-is.
        result[keyConverter(key)] = isObjectType(value) ? humps(value) : value
      }
      return result
    }

    return node
  }

  return humps
}

/**
 * Build a recursive key converter from a single-key converter.
 *
 * @example
 * import { toSnakeCase } from 'remeda'
 * const snakes = createHumps(toSnakeCase)
 * snakes({ attrOne: 'foo' }) // { attr_one: 'foo' }
 */
export default function createHumps(keyConverter: KeyConverter): Humps {
  return humpsFactory(keyConverter) as Humps
}
