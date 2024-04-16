import { test, is, ok, run, throws } from '../build/esm/index.js'

test('Test 2', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  ok(true, 'async')
})

run()
