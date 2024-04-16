import { diff } from 'jest-diff'
import {
  CYAN,
  GRAY,
  GREEN,
  RED,
  RESET,
  YELLOW,
  isNode,
  state,
} from './common.ts'
import type { AssertionData } from './asserts'

/**
 * Test state
 */
export type Test = {
  name: string
  run: Function
  index: number
  assertion: AssertionData[]
  pass(arg: any): void
  fail(arg: any): void
}

/**
 * Create a test with title and callback function for asserts,
 * such as: {@link ok}, {@link is}, {@link not}, {@link throws}.
 */
export function test(
  /**
   * Title of test
   */
  name: string,
  /**
   * Test function with asserts
   */
  run: () => void | Promise<any>,
): void {
  const test: Test = {
    name,
    run,
    index: state.index++,
    assertion: [],
    pass(arg: any) {
      if (typeof arg === 'string')
        return isNode
          ? console.log(`${GREEN}(pass) ${arg}${RESET}`)
          : console.log(`%c(pass) ${arg}`, 'color: green') // #229944

      let { operator: op, message: msg } = arg

      state.assertIndex++
      isNode
        ? console.log(`  ${GREEN}✔${RESET} ${msg}`) // √   ${op && ` (${op})`} ${state.assertIndex} -
        : console.log(`%c✔ ${msg}`, 'color: green') // #229944

      test.assertion.push({
        idx: state.assertIndex,
        msg,
      })
      state.passed++
    },
    fail(arg) {
      state.assertIndex++

      if (typeof arg === 'string') return console.error(arg)
      // when error is not assertion
      else if (arg.name !== 'Assertion') return console.error(arg)

      let { operator: op, message: msg, ...info } = arg

      isNode
        ? (console.log(`  ${RED}× ${msg}`), // ${state.assertIndex} -
          info &&
            'actual' in info &&
            console.info(diff(info.expects, info.actual), RESET))
        : // console.info(`actual:${RESET}`, typeof info.actual === 'string' ? JSON.stringify(info.actual) : info.actual, RED),
          // console.info(`expects:${RESET}`, typeof (info.expects ?? info.expected) === 'string' ? JSON.stringify(info.expects ?? info.expected) : (info.expects ?? info.expected), RED),
          // console.info(RESET) // console.error(new Error, RESET)
          info
          ? (console.log(`%c× ${msg}%c`, 'color:red', 'color:inherit', info),
            console.log(diff(info.expects, info.actual)))
          : console.assert(false, `${state.assertIndex} - ${msg}`)

      test.assertion.push({
        idx: state.assertIndex,
        msg,
        info,
        error: new Error(),
      })

      // Below in catch
      // state.failed ++
    },
  }

  state.queue = state.queue.then(async (prev) => {
    isNode ? console.log(`${RESET}► ${test.name}`) : console.group(test.name)

    let result
    try {
      state.currentTest = test
      result = await test.run(test.pass, test.fail)
      // let all planned errors to log
      await new Promise((r) => setTimeout(r))
    } catch (e) {
      test.fail(e)
      state.failed++
    } finally {
      state.currentTest = null
      if (!isNode) console.groupEnd()
      // else console.log()
    }

    return test
  })
}

let nestedRuns = 0

/**
 * Run all tests that have been enqueued.
 *
 * ```js
 * test('Test 1', () => {
 *   ok(true)
 * })
 *
 * test('Test 2', () => {
 *   ok(true)
 * })
 *
 * run()
 * ```
 *
 * To organize tests in multiple files, only call `run()` in the entry file, such as
 * `index.ts`. This ensures that there is a single report for all tests.
 *
 * ```js
 * import './test-1'
 * import './test-2'
 *
 * run()
 * ```
 *
 * Alternatively, if there are test files that also call `run()`, such as in a monorepo,
 * pass a function that dynamically imports them. This enqueues all tests and runs them
 * together with a single report at the end.
 *
 * ```js
 * run(async () => {
 *   await import('./test-1.js')
 *   await import('./test-2.js')
 * })
 * ```
 */
export async function run(fn?: () => Promise<any>) {
  if (fn) {
    nestedRuns++
    await fn()
    nestedRuns--
  }
  if (nestedRuns) return
  try {
    state.start()

    await state.queue

    // summary
    console.log(`---`)

    if (state.passed)
      console.log(
        `${isNode ? GREEN : ''}Pass ${state.passed}${isNode ? RESET : ''}`,
      )
    if (state.failed)
      console.log(
        `${isNode ? RED : ''}Fail ${state.failed}${isNode ? RESET : ''}`,
      )

    // const total = state.passed + state.failed
    // console.log(`Total ${total}`)

    if (isNode) process.exit(state.failed ? 1 : 0)
  } catch (e) {
    console.error(e)
    if (isNode) process.exit(1)
  }
}
