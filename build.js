import esbuild from 'esbuild'
import fs from 'node:fs/promises'
import { transformExtPlugin } from '@gjsify/esbuild-plugin-transform-ext'

const args = process.argv.slice(2)
let command = args.shift() || 'build'
const isDev = command === 'dev' || command === 'test'

if (isDev) command = args.shift() // Optional: cjs, esm, web

;(async () => {

  const { name } = JSON.parse(await fs.readFile('./package.json'))

  const esbuildOptions = {
    entryPoints: [
      `./src/web.ts`,
      './src/web.test.ts'
    ],
    // outfile: `./docs/${name}.js`,
    outdir: './docs',
    assetNames: '',
    format: 'iife',
    // globalName: '',
    platform: 'browser',
    logLevel: 'info',
    bundle: true,
    minify: !isDev,
    sourcemap: true,
    jsx: 'automatic',
    plugins: [
      // Built ES module format expects import from .js
      transformExtPlugin({ outExtension: { '.ts': '.js' } })
    ]
  }

  if (command === 'cjs') {

    // Individual files
    delete esbuildOptions.outfile

    Object.assign(esbuildOptions, {
      entryPoints: ['./src/**/*.ts'],
      outdir: './build/cjs',
      format: 'cjs',
      platform: 'node',
      bundle: false,
      minify: false,
      sourcemap: false,
    })
  } else if (command === 'esm' || command === 'test') {

    delete esbuildOptions.outfile

    Object.assign(esbuildOptions, {
      entryPoints: ['./src/**/*.ts'],
      outdir: './build/esm',
      format: 'esm',
      platform: 'node',
      bundle: false,
      minify: false,
      sourcemap: false,
    })
  } else if (command === 'web') {

    // Object.assign(esbuildOptions, {
    //   outfile: `./build/web/${name}.js`,
    // })

  } else if (command === 'docs') {

    // Fix link to screenshot
    const docsIndex = 'docs/api/index.html'
    await fs.writeFile(
      docsIndex,
      (await fs.readFile(docsIndex, 'utf8')).replace('docs/screenshot.png', '../screenshot.png')
    )
    console.log('Wrote', docsIndex)
    return
  } else {
    return
  }

  const context = await esbuild.context(esbuildOptions)

  await context.rebuild()

  if (command === 'cjs') {
    await fs.mkdir('build/cjs', { recursive: true })
    await fs.writeFile(`build/cjs/package.json`, `{"type": "commonjs"}`)
  } else if (command === 'esm') {
    await fs.mkdir('build/esm', { recursive: true })
    await fs.writeFile(`build/esm/package.json`, `{"type": "module"}`)
  } else if (command === 'web') {
    await fs.mkdir('build/web', { recursive: true })
    // Copy from docs
    await Promise.all([
      fs.copyFile(`./docs/web.js`, `./build/web/${name}.js`),
      fs.copyFile(`./docs/web.js.map`, `./build/web/${name}.js.map`),
    ])

  } else if (command === 'test') {
    // npm run test
  }

  if (isDev) {
    await context.watch()
    await context.serve({
      port: 8080,
      servedir: './docs'
    })
  } else {
    process.exit()
  }

})().catch((error) => {
  console.error(error)
  process.exit(1)
})
