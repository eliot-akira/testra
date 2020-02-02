import { LoggerInterface } from './log/common'

export type Reporter = (type: ReportType, ...args: any[]) => void
export type ReportType =
  'title' | 'assert' | 'error' | 'summary'
  | 'groupTitle' | 'groupAssert' | 'groupError' | 'groupsSummary'

export const plural = (num: number, single: string, plural: string) => num > 1 ? plural : single

export const createReporter = (logger: LoggerInterface) => {

  const { log, green, red } = logger

  const reporter: Reporter = (type, ...args) => {
    switch (type) {
    case 'title': {
      const [title, index] = args
      log``
      log`${index + 1}. ${title}`
      break
    }
    case 'assert': {
      const [title, result, ...info] = args
      log`  ${ result ? green('✓') : red('✕') } ${title}`
      if (info.length) info.forEach(i => console.log(i))
      break
    }
    case 'error':
    case 'groupError': {
      const [error] = args
      log`${error.message || error}`
      break
    }
    case 'summary': {
      const [{ success, fail }] = args

      log``
      if (success) {
        if (fail) log`${success} test${ plural(success, '', 's') } passed`
        else log`All ${success} test${ plural(success, '', 's') } passed`
      }
      if (fail) log`${fail} test${ plural(fail, '', 's') } failed`

      break
    }

    case 'groupTitle': {
      const [title] = args
      log``
      log`${title}`
      break
    }
    case 'groupAssert': {
      const [title, result] = args
      log`${ result ? green('✓') : red('✕') } ${title}`
      break
    }
    case 'groupsSummary': {
      const [{ success, fail }] = args

      log``
      if (success) {
        if (fail) log`${success} test group${ plural(success, '', 's') } passed`
        else log`All ${success} test group${ plural(success, '', 's') } passed`
      }
      if (fail) log`${fail} test group${ plural(fail, '', 's') } failed`
      log``
      break
    }
    default:
      break
    }
  }

  return reporter
}
