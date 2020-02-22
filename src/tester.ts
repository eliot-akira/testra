import { is, AssertIs, throws, AssertThrows } from './assert'
import { Reporter } from './reporter'

export type AssertIt = {
  (title: string, result: boolean, ...info: any[]): void
  is: AssertIs
  throws: AssertThrows
}

export type TestFunction = (title: string, fn: TestCallback, info?: { [key: string]: any }) => void
export type TestCallback = (it: AssertIt, is: AssertIs) => void | Promise<void>

export type TestData = {
  title: string
  fn: TestCallback
}

export type Results = {
  success: number
  fail: number
}

export type TestsRunner = (props?: { report?: Reporter, defaultReporter?: Reporter }) => Promise<Results>


export const tests: TestData[] = []

export const test: TestFunction = (title, fn) => {
  tests.push({ title, fn })
}

export const clearTests = () => {
  return tests.splice(0)
}

export const setTests = (arr: TestData[]) => {
  clearTests()
  tests.push(...arr)
}

export const createResults = (): Results => ({
  success: 0,
  fail: 0
})

export const runTests: TestsRunner = async (props = {}) => {

  const {
    report = props.defaultReporter || ((...args) => console.log(...args))
  } = props

  const results: Results = createResults()

  const it: AssertIt = Object.assign(
    (title: string, result: boolean, ...info: any[]) => {
      report('assert', title, result, ...info)
      results[ result ? 'success' : 'fail' ]++
    },
    { is, throws }
  )

  let i = 0
  for (const { title, fn } of tests) {
    report('title', title, i++)
    try {

      await fn(it, is)

    } catch(e) {
      report('error', e)
      results.fail++
    }
  }

  report('summary', results)

  clearTests()

  return results
}
