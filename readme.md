# Test Runner

## Install

```sh
yarn add --dev testa
```

## Use

`src/test/index.{ts,js}`

```js
import { test, runTests } from 'testa'

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
import { testGroup, runTestGroups } from 'testa'

testGroup('Group name', test => {

  // require('@babel/register')

  require('./feature')(test)
  require('./another-feature')(test)
})

runTestGroups() // const result = await runTestGroups()
```

`src/test/feature.{ts,js}`

```js
export default test => {

  test('Feature name', (it, is) => {

    // it(title, trueOrFalse)

  })
}
```

### Run

Use script in `package.json`

Example

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
