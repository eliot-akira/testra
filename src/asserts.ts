import { state } from './common.ts'

/**
 * Assertions
 * @module
 */

export type AssertionData = {
  index: number
  title: string
  info?: any
  error?: Error
}

/**
 * Assert that a value is truthy: everything except `false`, `0`, `-0`, `0n`, `null`, `undefined`, `NaN`, or empty string.
 * @throws {@link Assertion}
 */
export function ok(value: any, title = 'should be truthy'): void {
  if (Boolean(value)) return state.currentTest?.pass({ operator: 'ok', title })

  throw new Assertion({
    operator: 'ok',
    title,
    expects: true,
    actual: value,
  })
}

/**
 * Assert two values are deep equal. Unlike strict equal comparison with `===`,
 * deep equal compares all properties of arrays and objects, including any cyclic
 * references.
 * @throws {@link Assertion}
 */
export function is(a: any, b: any, title = 'should be the same') {
  if (isPrimitive(a) || isPrimitive(b) ? Object.is(a, b) : deepEqual(a, b)) {
    return state.currentTest?.pass({ operator: 'is', title })
  }
  throw new Assertion({
    operator: 'is',
    title,
    expects: slice(a),
    actual: slice(b),
  })
}

/**
 * Assert that two values are not deep equal.
 * @throws {@link Assertion}
 */
export function not(a: any, b: any, title = 'should be different') {
  if (isPrimitive(a) || isPrimitive(b) ? !Object.is(a, b) : !deepEqual(a, b))
    return state.currentTest?.pass({ operator: 'not', title })

  throw new Assertion({
    operator: 'is not',
    title,
    expects: slice(a),
    // this contraption makes chrome debugger display nicer
    actual: new (class Not {
      actual: any
      constructor(a: any) {
        this.actual = a
      }
    })(a),
  })
}

/**
 * Assert that a function throws an error.
 * @throws {@link Assertion}
 */
export function throws(fn: Function, title = 'should throw') {
  try {
    fn()
    throw new Assertion({ operator: 'throws', title })
  } catch (err) {
    if (err instanceof Assertion) throw err
    return state.currentTest?.pass({ operator: 'throws', title })
  }
}

/**
 * Compare two values as deep equal
 */
export function deepEqual(a: any, b: any): boolean {
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

/**
 * Assert functions throw this when assertion fails
 */
export class Assertion extends Error {
  title: string
  operator?: string
  expects?: any
  actual?: any
  constructor(
    opts: {
      title: string
      operator?: string
      expects?: any
      actual?: any
    } = { title: '' },
  ) {
    super(opts.title)
    this.title = opts.title
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor)
    this.operator = opts.operator
    this.expects = opts.expects
    this.actual = opts.actual
  }
}

Assertion.prototype.name = 'Assertion'
