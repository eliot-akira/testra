import { createResults, Results, test, clearTests, setTests, runTests, TestFunction } from './tester'
import { Reporter } from './reporter'

type TestGroup = {
  name: string
  fn: TestGroupCallback
}

type TestGroupCallback = (test: TestFunction) => void | Promise<void>

const testGroups: TestGroup[] = []

const clearTestGroups = (): TestGroup[] => {
  return testGroups.splice(0)
}

export const setTestGroups = (arr: TestGroup[]) => {
  clearTestGroups()
  testGroups.push(...arr)
}

export const testGroup = (name: string, fn: TestGroupCallback) => {
  testGroups.push({
    name,
    fn
  })
}

export const runTestGroups = async (props: {
  report?: Reporter,
  defaultReporter?: Reporter
} = {}): Promise<Results> => {

  const {
    report = props.defaultReporter || ((...args) => console.log(...args))
  } = props


  const previousTests = clearTests()
  const testGroups = clearTestGroups()
  const totalResults = createResults()

  for (const { name, fn } of testGroups) {

    report('groupTitle', name)

    await fn(test)

    let failed

    try {
      failed = (await runTests({ report })).fail
    } catch(e) {
      failed = true
      report('groupError', e)
    }

    if (failed) {
      totalResults.fail++
    } else {
      totalResults.success++
    }

    report('groupAssert', name, !failed)
  }

  report('groupsSummary', totalResults)

  setTests(previousTests)

  return totalResults
}
