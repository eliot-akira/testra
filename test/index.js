import { test, is, ok, run, throws } from '../build/esm/index.js'

test('test 1', () => {

  ok(true, 'truthy')

  throws(() => someFn(), 'should throw')

  is({ a: 1 }, { b: 2 }, 'deep equal')
})

test('test 2', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  ok(true, 'async')
})

run()
