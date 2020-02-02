import { inspect } from 'util'
import ansiStyles from 'ansi-styles'
import { createProperties, parse, Data, LoggerInterface } from './common'

const backgroundsMapping: {
  [key: string]: string
} = {
  black: 'bgBlack',
  red: 'bgRed',
  green: 'bgGreen',
  yellow: 'bgYellow',
  blue: 'bgBlue',
  magenta: 'bgMagenta',
  cyan: 'bgCyan',
  white: 'bgWhite',
}

function transform(value: any): string {
  const valueType = typeof value

  if (valueType === 'number' || valueType === 'string' || value instanceof String) {
    return value
  } else if (value instanceof Data) {
    const { text, styles } = value
    let output = ''

    if (styles.color) {
      output += (ansiStyles as any)[styles.color].open
    }
    if (styles.background) {
      output += (ansiStyles as any)[ backgroundsMapping[ styles.background ] ].open
    }
    if (styles.weight) {
      output += (ansiStyles as any)[styles.weight].open
    }
    if (styles.style) {
      output += (ansiStyles as any)[styles.style].open
    }
    if (styles.inverse) {
      output += ansiStyles.inverse.open
    }
    if (styles.hidden) {
      output += ansiStyles.hidden.open
    }
    if (styles.decoration) {
      output += (ansiStyles as any)[styles.decoration].open
    }

    output += text
    output += ansiStyles.reset.close

    return output
  }

  return inspect(value, {
    colors: true,
    depth: null,
  })
}

function log(strings: TemplateStringsArray, ...keys: any[]): boolean {
  if (typeof console === 'undefined') {
    return false
  }

  console.log(...parse(strings, keys, (string: string): string => transform(string)))

  return true
}

const logger: LoggerInterface = Object.assign({
  log
}, createProperties())

export default logger