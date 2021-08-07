export const groupBy = function<T>(xs: T[], key: keyof T):{ [x: string]: T[]; } {
  return xs.reduce(function(rv: any, x: T) {
    (rv[x[key]] = rv[x[key]] || []).push(x)

    return rv
  }, {})
}
