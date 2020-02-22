import { test, runTests, testGroup, runTestGroups } from '../index'

test('testra', async (it, is) => {

  console.log('---')
  testGroup('Test group', async (test) => {

    test('Feature name', (it, is) => {

      it('exists', true)
      it('is true', false)

      const obj1 = { key: 'value' }
      const obj2 = { key: 'value' }

      it('has deep-strict equal values', is(obj1, obj2))
    })
  })

  const { success, fail } = await runTestGroups()
  console.log('---')

  it('Runs tests', is(fail, 1), { success, fail })
})

runTests()
