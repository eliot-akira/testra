import { test, is, ok, run, throws } from '../build/esm/index.js'

test('Test 1', () => {
  ok(true, 'truthy')
  throws(() => someFn(), 'throws')
  is({ a: 1 }, { b: 2 }, 'deep equal - should fail')
})

run()
