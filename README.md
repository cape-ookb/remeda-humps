# remeda-humps v4.0.0

Converting object keys to camelCase. Works on deeply nested objects/arrays. Handy for converting underscore keys to camelCase. Written in TypeScript and powered by [Remeda](https://remedajs.com) — small, tree-shakeable, and fully typed.

## Install

```bash
$ npm i remeda-humps
```

`remeda` is a peer-friendly runtime dependency and is installed automatically.

## Usage

### Converting object keys

Removes any hyphens, underscores, and whitespace characters, and uppercases the first character that follows. Returns a new object. See Remeda's [`toCamelCase()`](https://remedajs.com/docs/#toCamelCase) and <https://en.wikipedia.org/wiki/CamelCase>.

```ts
import humps from 'remeda-humps'

const object = { attr_one: 'foo', attr_two: 'bar', attr_three: { attr_one: 'foo' } }
humps(object) // { attrOne: 'foo', attrTwo: 'bar', attrThree: { attrOne: 'foo' } }
```

Arrays of objects are also converted:

```ts
const array = [{ attr_one: 'foo' }, { attr_one: 'bar' }]
humps(array) // [{ attrOne: 'foo' }, { attrOne: 'bar' }]
```

### Custom key converter

Want to convert keys the other way, or with your own rule? Import `createHumps` from the subpath and pass any `(key: string) => string` converter — for example Remeda's `toSnakeCase`:

```ts
import createHumps from 'remeda-humps/createHumps'
import { toSnakeCase } from 'remeda'

const snakes = createHumps(toSnakeCase)
const object = { attrOne: 'foo', attrTwo: 'bar', attrThree: { attrOne: 'foo' } }
snakes(object) // { attr_one: 'foo', attr_two: 'bar', attr_three: { attr_one: 'foo' } }
```

### TypeScript

`humps` has two call shapes. Called plainly, it infers the result type from the input — convenient when the keys already line up with your type. Called with an explicit type argument, it asserts the converted shape you expect, since the runtime keys change but the structure stays the same:

```ts
import humps from 'remeda-humps'

interface ApiUser { first_name: string }
interface User { firstName: string }

const apiUser: ApiUser = { first_name: 'Ada' }

const inferred = humps(apiUser)        // typed as ApiUser (structure unchanged)
const user = humps<User>(apiUser)      // typed as User
```

### CommonJS

The default export is CommonJS-friendly, so `require` returns the function directly:

```js
const humps = require('remeda-humps')
const createHumps = require('remeda-humps/createHumps')
```

## Behaviour notes

- Only **plain objects** (created by the `Object` constructor / object literals) have their keys converted. Class instances, dates, etc. are returned untouched — wrap them in a spread, e.g. `humps({ ...someInstance })`, if you need them processed.
- Only object **values** are recursed into; primitive and function values are preserved as-is, including function properties.

## Migrating from `lodash-humps`

`remeda-humps` is the TypeScript + Remeda successor to [`lodash-humps`](https://www.npmjs.com/package/lodash-humps).

- Default `humps` import is unchanged.
- `createHumps` moved from `lodash-humps/lib/createHumps` to the `remeda-humps/createHumps` subpath export.
- Key casing is now produced by Remeda's `toCamelCase` instead of `_.camelCase`; output is equivalent for the common underscore/hyphen/space/UPPERCASE cases.

## Prior Art

- <https://www.npmjs.com/package/lodash-humps>
- <https://www.npmjs.com/package/humps>
