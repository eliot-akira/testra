# Testra

Minimal test runner

![Screenshot](docs/screenshot.png)

#### [Documentation - API](https://eliot-akira.github.io/testra/api/) · [Source](https://github.com/eliot-akira/testra)

## Install

```sh
npm install --save-dev testra
```

## Overview

1. Create tests with title and callback (can be async).
2. Call asserts inside test: `is`, `ok`, `not`, `throws`
3. Run them with `run`

```js
import { test, is, ok, run, throws } from 'testra'

test('Test 1', () => {
  ok(true, 'truthy')
  is({ a: 1 }, { b: 2 }, 'deep equal')
  throws(() => someFn(), 'should throw')
})

test('Test 2', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  ok(true, 'async')
})

run()
```
