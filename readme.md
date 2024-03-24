# Testra

Minimal test runner

```js
import { test, is, ok, run, throws } from 'testra'

test('test 1', () => {
  ok(true, 'truthy')
  is({ a: 1 }, { b: 2 }, 'deep equal')
  throws(() => someFn(), 'should throw')
})

test('test 2', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  ok(true, 'async')
})

run()
```
