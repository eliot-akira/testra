import { Styles, createProperties, parse, Data, LoggerInterface } from './common'

const colorsMapping: {
  [key: string]: string
} = {
  black: 'black',
  red: 'rgb(187,0,0)',
  green: 'rgb(0,187,0)',
  yellow: 'rgb(187,187,0)',
  blue: 'rgb(0,0,187)',
  magenta: 'rgb(187,0,187)',
  cyan: 'rgb(0,187,187)',
  white: 'white',
  gray: 'gray',
}

const weightsMapping: {
  [key: string]: string | number
} = {
  bold: 'bold',
  dim: 200,
}

const decorationsMapping: {
  [key: string]: string
} = {
  strikethrough: 'line-through',
  underline: 'underline'
}

function marshal(styles: Styles): string {
  return Object.keys(styles).reduce((acc: string, key: string): string => (
    `${acc}${key}:${styles[ key as keyof Styles ]};`
  ), '')
}


function transform(value: any, args: any[]): string {

  const valueType = typeof value

  if (valueType === 'number' || valueType === 'string' || value instanceof String) {
    return value
  } else if (value instanceof Data) {

    const {
      text,
      styles
    } = value
    const cssStyles: { [key: string]: any } = {}

    if (styles.color) {
      cssStyles[styles.inverse ? 'background' : 'color'] = colorsMapping[styles.color]
    }
    if (styles.background) {
      cssStyles[styles.inverse ? 'color' : 'background'] = colorsMapping[styles.background]
    }
    if (cssStyles.background && !cssStyles.color) {
      cssStyles.color = colorsMapping.white
    }
    if (styles.weight) {
      cssStyles['font-weight'] = weightsMapping[styles.weight]
    }
    if (styles.style) {
      cssStyles['font-style'] = styles.style
    }
    if (styles.hidden) {
      cssStyles.opacity = '0%'
    }
    if (styles.decoration) {
      cssStyles['text-decoration'] = decorationsMapping[styles.decoration]
    }

    // Any empty string as CSS permits to reset the styles
    args.push(marshal(cssStyles))
    args.push('')
    return `%c${text}%c`
  }

  args.push(value)
  return ''
}

function log(strings: TemplateStringsArray, ...keys: any[]): boolean {
  if (typeof console === 'undefined') {
    return false
  }

  console.log(...parse(strings, keys, (string: string, args: any[]): string => transform(string, args)))

  return true
}

const logger: LoggerInterface = Object.assign({
  log
}, createProperties())

export default logger