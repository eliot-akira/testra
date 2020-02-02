import { is, AssertIs } from './assert'
import { Reporter } from './reporter'

export type AssertIt = (title: string, result: boolean, ...info: any[]) => void

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


const tests: TestData[] = []

export const test: TestFunction = (title, fn) => {
  tests.push({ title, fn })
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

  const it: AssertIt = (title, result, ...info) => {
    report('assert', title, result, ...info)
    results[ result ? 'success' : 'fail' ]++
  }

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

  tests.splice(0)

  return results
}
