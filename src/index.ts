/**
 * Forked from https://github.com/dy/tst/
 */
import { diff } from 'jest-diff'

const GREEN = '\u001b[32m',
  RED = '\u001b[31m',
  YELLOW = '\u001b[33m',
  RESET = '\u001b[0m',
  CYAN = '\u001b[36m',
  GRAY = '\u001b[30m'

const isNode = typeof process !== 'undefined'

let assertIndex = 0,
  index = 1,
  passed = 0,
  failed = 0,
  current: Test | null,
  start: Function,
  queue = new Promise((resolve) => (start = resolve))

type Test = {
  name: string
  run: Function
  index: number
  assertion: AssertionData[]
  pass(arg: any): void
  fail(arg: any): void
}

type AssertionData = {
  idx: number
  msg: string
  info?: any
  error?: Error
}

export function test(name: string, run: Function) {
  const test: Test = {
    name,
    run,
    index: index++,
    assertion: [],
    pass(arg: any) {
      if (typeof arg === 'string')
        return isNode
          ? console.log(`${GREEN}(pass) ${arg}${RESET}`)
          : console.log(`%c(pass) ${arg}`, 'color: green') // #229944

      let { operator: op, message: msg } = arg

      assertIndex++
      isNode
        ? console.log(`  ${GREEN}✔${RESET} ${msg}`) // √   ${op && ` (${op})`} ${assertIndex} -
        : console.log(`%c✔ ${msg}`, 'color: green') // #229944

      test.assertion.push({
        idx: assertIndex,
        msg,
      })
      passed += 1
    },
    fail(arg) {
      assertIndex++

      if (typeof arg === 'string') return console.error(arg)
      // when error is not assertion
      else if (arg.name !== 'Assertion') return console.error(arg)

      let { operator: op, message: msg, ...info } = arg

      isNode
        ? (console.log(`  ${RED}× ${msg}`), // ${assertIndex} -
          info &&
            'actual' in info &&
            console.info(diff(info.expects, info.actual), RESET))
        : // console.info(`actual:${RESET}`, typeof info.actual === 'string' ? JSON.stringify(info.actual) : info.actual, RED),
          // console.info(`expects:${RESET}`, typeof (info.expects ?? info.expected) === 'string' ? JSON.stringify(info.expects ?? info.expected) : (info.expects ?? info.expected), RED),
          // console.info(RESET) // console.error(new Error, RESET)
          info
          ? (console.log(`%c× ${msg}%c`, 'color:red', 'color:inherit', info),
            console.log(diff(info.expects, info.actual)))
          : console.assert(false, `${assertIndex} - ${msg}`)

      test.assertion.push({
        idx: assertIndex,
        msg,
        info,
        error: new Error(),
      })

      // Below in catch
      // failed += 1
    },
  }

  queue = queue.then(async (prev) => {
    isNode ? console.log(`${RESET}► ${test.name}`) : console.group(test.name)

    let result
    try {
      current = test
      result = await test.run(test.pass, test.fail)
      // let all planned errors to log
      await new Promise((r) => setTimeout(r))
    } catch (e) {
      test.fail(e)
      failed += 1
    } finally {
      current = null
      if (!isNode) console.groupEnd()
      // else console.log()
    }

    return test
  })
}

/**
 * Run tests
 */
export async function run() {
  try {
    start()

    await queue

    // summary
    console.log(`---`)

    if (passed)
      console.log(`${isNode ? GREEN : ''}Pass ${passed}${isNode ? RESET : ''}`)
    if (failed)
      console.log(`${isNode ? RED : ''}Fail ${failed}${isNode ? RESET : ''}`)

    // const total = passed + failed
    // console.log(`Total ${total}`)

    if (isNode) process.exit(failed ? 1 : 0)
  } catch (e) {
    console.error(e)
  }
}

/**
 * Assertions
 */

export function ok(value: any, msg = 'should be truthy') {
  if (Boolean(value)) return current?.pass({ operator: 'ok', message: msg })

  throw new Assertion({
    operator: 'ok',
    message: msg,
    actual: value,
    expects: true,
  })
}

export function is(a: any, b: any, msg = 'should be the same') {
  if (isPrimitive(a) || isPrimitive(b) ? Object.is(a, b) : deepEqual(a, b))
    return current?.pass({ operator: 'is', message: msg })

  throw new Assertion({
    operator: 'is',
    message: msg,
    actual: slice(a),
    expects: slice(b),
  })
}

export function not(a: any, b: any, msg = 'should be different') {
  if (isPrimitive(a) || isPrimitive(b) ? !Object.is(a, b) : !deepEqual(a, b))
    return current?.pass({ operator: 'not', message: msg })

  throw new Assertion({
    operator: 'is not',
    message: msg,
    actual: slice(a),
    // this contraption makes chrome debugger display nicer
    expects: new (class Not {
      actual: any
      constructor(a: any) {
        this.actual = a
      }
    })(a),
  })
}

export function throws(fn: Function, msg = 'should throw') {
  try {
    fn()
    throw new Assertion({ operator: 'throws', message: msg })
  } catch (err) {
    if (err instanceof Assertion) throw err
    return current?.pass({ operator: 'throws', message: msg })
  }
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a && b) {
    if (a.constructor === b.constructor) {
      if (a.constructor === RegExp) return a.toString() === b.toString()
      if (a.constructor === Date) return a.getTime() === b.getTime()
      if (a.constructor === Array)
        return a.length === b.length && a.every((a, i) => deepEqual(a, b[i]))
      if (a.constructor === Object)
        return (
          Object.keys(a).length === Object.keys(b).length &&
          Object.keys(a).every((key) => deepEqual(a[key], b[key]))
        )
    }
    if (!isPrimitive(a) && a[Symbol.iterator] && b[Symbol.iterator])
      return deepEqual([...a], [...b])
  }
  return a !== a && b !== b
}

function isPrimitive(val: any) {
  if (typeof val === 'object') {
    return val === null
  }
  return typeof val !== 'function'
}

const slice = (a: any) =>
  isPrimitive(a) ? a : a.slice ? a.slice() : Object.assign({}, a)

class Assertion extends Error {
  operator?: string
  expects?: any
  actual?: any
  constructor(
    opts: {
      message?: string
      operator?: string
      expects?: any
      actual?: any
    } = {},
  ) {
    super(opts.message)
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor)
    this.operator = opts.operator
    this.expects = opts.expects
    this.actual = opts.actual
  }
}

Assertion.prototype.name = 'Assertion'
