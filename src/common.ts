import type { Test } from './test'

let start: (value?: unknown) => void = () => {}
const queue = new Promise<any>((resolve) => (start = resolve))

export const state: {
  assertIndex: number
  index: number
  passed: number
  failed: number
  currentTest: Test | null
  start: typeof start
  queue: typeof queue
} = {
  assertIndex: 0,
  index: 1,
  passed: 0,
  failed: 0,
  currentTest: null,
  start,
  queue,
}

export const GREEN = '\u001b[32m',
  RED = '\u001b[31m',
  YELLOW = '\u001b[33m',
  RESET = '\u001b[0m',
  CYAN = '\u001b[36m',
  GRAY = '\u001b[30m'

export const isNode = typeof process !== 'undefined'
