import type * as Testra from './'

declare var window: {
  testra: typeof Testra
}

const { testra } = window
const { test, is, ok, run, throws } = testra

console.log('testra', testra)

test('test 1', () => {
  ok(true, 'truthy')

  throws(() => {
    throw new Error('ok')
  }, 'should throw')

  is({ a: 1 }, { b: 2 }, 'deep equal')
})

test('test 2', async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  ok(true, 'async')
})

run()
