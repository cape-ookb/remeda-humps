import { toCamelCase } from 'remeda'
import createHumps from './createHumps'

// `createHumps` is published as a subpath: import it from 'remeda-humps/createHumps'.
// Keeping the main entry to a single default export lets CommonJS consumers do
// `require('remeda-humps')` and get the function directly.
export type { Humps, KeyConverter } from './createHumps'

/**
 * Recursively camelCase the keys of an object (or array of objects).
 *
 * @example
 * import humps from 'remeda-humps'
 * humps({ attr_one: 'foo', attr_two: { attr_three: 'bar' } })
 * // { attrOne: 'foo', attrTwo: { attrThree: 'bar' } }
 */
const humps = createHumps((key) => toCamelCase(key))

// Only export the one default. `createHumps` is available as a named export.
export default humps
