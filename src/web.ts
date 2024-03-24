import * as testra from './index'

declare var window: {
  testra: typeof testra
}

window.testra = testra
