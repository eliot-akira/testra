const path = require('path')
const { waitKeyPressAndReload } = require('./index')

const cwd = process.cwd()
const options = {} as { [key: string]: any }
const args = process.argv.slice(2)
  .filter(arg => {
    if (arg[0]!=='-') return true
    arg = arg.substr(1)
    if (arg[0] && arg[0]==='-') arg = arg.substr(1)
    const [key, value = true] = arg.split('=')
    options[key] = value
    return false
  })

const [file] = args

if (!file) {
  console.log('Usage: testra [file name] (-w for watch mode)')
  process.exit()
}

const loadFile = async () => {
  try {
    let m = require(path.join(cwd, file))
    if (m instanceof Function) m = m(require('./index'))
    return await m
  } catch(e) {
    console.error(e.message)
  }
}

loadFile().then(() => {
  if (options.w) waitKeyPressAndReload(loadFile)
})
