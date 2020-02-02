import logger from './log/node'
import { createReporter } from './reporter'
import { test, runTests } from './tester'
import { testGroup, runTestGroups } from './group'

const defaultReporter = createReporter(logger)

const runServerTests = (props: any = {}) => {
  return runTests({
    ...props,
    defaultReporter
  })
}

const runServerTestGroups = (props: any = {}) => {
  return runTestGroups({
    ...props,
    defaultReporter
  })
}

export {
  test,
  runServerTests as runTests,
  testGroup,
  runServerTestGroups as runTestGroups
}
