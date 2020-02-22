
export type AssertIs = (a: any, b: any) => boolean

export const is: AssertIs = deepStrictEqual

function deepStrictEqual(a: any, b: any, visited: Set<any> = new Set()): boolean {

  const aType = typeof a

  if (aType !== typeof b) return false

  if (a == null || b == null || !(aType === 'object' || aType === 'function')) {

    if (aType === 'number' && isNaN(a) && isNaN(b)) return true

    return a === b
  }

  if (Array.isArray(a) !== Array.isArray(b))  return false

  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)

  if (aKeys.length !== bKeys.length) return false

  for (const key of aKeys) {

    if (!(key in b)) return false

    if (a[key] && a[key] instanceof Object) {
      if (visited.has(a[key])) continue
      visited.add(a[key])
    }

    if (!deepStrictEqual(a[key], b[key], visited)) return false
  }

  return true
}

export type AssertThrows = (fn: () => any | never) => boolean
export const throws: AssertThrows = fn => {
  try {
    fn()
    return false
  } catch(e) {
    return true
  }
}
