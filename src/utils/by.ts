export const keyBy = <T>(arr: T[], key: string): Record<string, T> => arr.reduce((acc: Record<string, T>, el) => {
  const newKey = String(el[key as keyof T])
  acc[newKey] = el

  return acc
}, {})

export const groupBy = function<T>(xs: T[], key: keyof T):{ [x: string]: T[]; } {
  return xs.reduce(function(rv: any, x: T) {
    (rv[x[key]] = rv[x[key]] || []).push(x)

    return rv
  }, {})
}

export const objectMap = (obj: any, fn: any) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([ k, v ], i) => [ k, fn(v, k, i) ]
    )
  )
