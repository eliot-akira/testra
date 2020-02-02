# Test Runner

## Install

```sh
yarn add --dev testra
```

## Use

Example: `src/test/index.{ts,js}`

```js
import { test, runTests } from 'testra'

test('Feature name', (it, is) => {

  it('exists', true)
  it('is true', false)

  const obj1 = { key: 'value' }
  const obj2 = { key: 'value' }

  it('has deep-strict equal values', is(obj1, obj2))
})

runTests() // const result = await runTests()
```

### Test groups

```js
import { testGroup, runTestGroups } from 'testra'
import featureTest from './feature'
import anotherFeatureTest from './anotherFeature'

testGroup('Group name', test => {

  featureTest(test)
  anotherFeatureTest(test)
})

runTestGroups() // const result = await runTestGroups()
```

Example: `src/test/feature.{ts,js}`

```js
export default test => {

  test('Feature name', (it, is) => {

    // it(title, trueOrFalse)

  })
}
```

### Load

Use a script in `package.json` to load your test entry file.

Example

```json
{
  "scripts": {
    "test": "node src/test/index.js"
  }
}
```

Example with [`ts-node`](https://github.com/TypeStrong/ts-node)

```json
{
  "scripts": {
    "test": "ts-node --transpile-only src/test/index.ts"
  },
  "devDependencies": {
    "ts-node": "*"
  }
}
```

Example with [`@babel/node`](https://github.com/babel/babel/tree/master/packages/babel-node)

```json
{
  "scripts": {
    "test": "babel-node src/test/index.ts"
  },
  "devDependencies": {
    "@babel/node": "*"
  }
}
```

This library uses itself for tests. See the `dev` script in `package.json` for an example with [`concurrently`](https://github.com/kimmobrunfeldt/concurrently) and [`nodemon`](https://github.com/remy/nodemon).

## Develop this library

Install dependencies

```sh
yarn
```

Develop: Watch files; Recompile, type check and test on changes

```sh
yarn dev
```

Build

```sh
yarn build
```

Publish to NPM

```sh
npm run release
```
