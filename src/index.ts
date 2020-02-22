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

const getTime = () => {
  const date = new Date()
  const str = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
    .toISOString()
  return str.slice(0, 10)+' '+str.slice(11, 22)
}

const clearRequireCache = () => {
  Object.keys(require.cache).forEach(key => {
    delete require.cache[key]
  })
}

const waitKeyPressAndReload = (fn: () => any) => {
    logger.log`${logger.gray(getTime())}`
    logger.log`${logger.gray('Press enter to run again, "q" to quit')}`

    process.stdin.once('data', function (b) {
      const data = b.toString().trim()
      if (data==='q') {
        process.exit()
        return
      }
      clearRequireCache()
      console.log('-----')
      fn()
      .then(() => waitKeyPressAndReload(fn))
      .catch((e: Error) => console.error(e))
    })
}

export {
  test,
  runServerTests as runTests,
  testGroup,
  runServerTestGroups as runTestGroups,
  waitKeyPressAndReload
}
