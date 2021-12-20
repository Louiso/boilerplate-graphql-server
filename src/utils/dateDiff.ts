const monthDiff = (dateStart: Date, dateEnd: Date): number => {
  let months
  months = (dateEnd.getFullYear() - dateStart.getFullYear()) * 12
  months -= dateStart.getMonth()
  months += dateEnd.getMonth()

  return months <= 0 ? 0 : months
}

export {
  monthDiff
}
