export function sortBy<T>(fieldName: keyof T, direction: 'asc' |'desc' = 'asc') {
  return (experienceA: T, experienceB: T): number => (direction === 'asc' ? 1 : -1) * (Number(experienceA[fieldName]) - Number(experienceB[fieldName]))
}
