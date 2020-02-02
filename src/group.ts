import { createResults, test, runTests, TestFunction } from './tester'
import { Reporter } from './reporter'

type TestGroup = {
  name: string
  fn: TestGroupCallback
}

type TestGroupCallback = (test: TestFunction) => void | Promise<void>

const testGroups: TestGroup[] = []

export const testGroup = (name: string, fn: TestGroupCallback) => {
  testGroups.push({
    name,
    fn
  })
}

export const runTestGroups = async (props: {
  report?: Reporter,
  defaultReporter?: Reporter
} = {}) => {

  const {
    report = props.defaultReporter || ((...args) => console.log(...args))
  } = props

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

  testGroups.splice(0)

  return totalResults
}
