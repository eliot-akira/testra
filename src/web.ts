import logger from './log/web'
import { createReporter } from './reporter'
import { test, runTests } from './tester'
import { testGroup, runTestGroups } from './group'

const defaultReporter = createReporter(logger)

const runWebTests = (props: any = {}) => {
  return runTests({
    ...props,
    defaultReporter
  })
}

const runWebTestGroups = (props: any = {}) => {
  return runTestGroups({
    ...props,
    defaultReporter
  })
}

export {
  test,
  runWebTests as runTests,
  testGroup,
  runWebTestGroups as runTestGroups
}
