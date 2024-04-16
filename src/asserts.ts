import { state } from './common.ts'

/**
 * Assertions
 * @module
 */

export type AssertionData = {
  idx: number
  msg: string
  info?: any
  error?: Error
}

/**
 * Assert that a value is truthy: everything except `false`, `0`, `-0`, `0n`, `null`, `undefined`, `NaN`, or empty string.
 */
export function ok(value: any, msg = 'should be truthy'): void | never {
  if (Boolean(value))
    return state.currentTest?.pass({ operator: 'ok', message: msg })

  throw new Assertion({
    operator: 'ok',
    message: msg,
    actual: value,
    expects: true,
  })
}

/**
 * Assert deep equal
 */
export function is(a: any, b: any, msg = 'should be the same') {
  if (isPrimitive(a) || isPrimitive(b) ? Object.is(a, b) : deepEqual(a, b))
    return state.currentTest?.pass({ operator: 'is', message: msg })

  throw new Assertion({
    operator: 'is',
    message: msg,
    actual: slice(a),
    expects: slice(b),
  })
}

/**
 * Assert not deep equal
 */
export function not(a: any, b: any, msg = 'should be different') {
  if (isPrimitive(a) || isPrimitive(b) ? !Object.is(a, b) : !deepEqual(a, b))
    return state.currentTest?.pass({ operator: 'not', message: msg })

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

/**
 * Assert a function throws an error
 */
export function throws(fn: Function, msg = 'should throw') {
  try {
    fn()
    throw new Assertion({ operator: 'throws', message: msg })
  } catch (err) {
    if (err instanceof Assertion) throw err
    return state.currentTest?.pass({ operator: 'throws', message: msg })
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
