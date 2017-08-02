/*
 * This does the same thing as Array.map, but it also works with objects
 */

export default function map (obj: any, func: Function) {
  // for arrays
  if (Array.isArray(obj)) return obj.map(func as any)

  // for objects
  const keys = Object.keys(obj)
  const accum = keys.reduce((accum, key) => {
    const value = accum.source[key]
    accum.results[key] = func(value, key)
    return accum
  }, {source: obj, results: {} as any})
  return accum.results
}
