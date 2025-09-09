export const convertToCm = (value: number, unit: string): number => {
  if (unit === 'in') {
    return value * 2.54
  }
  return (value*1)
}

export const convertToKg = (value: number, unit: string): number => {
  if (unit === 'lbs') {
    return value * 0.453592
  }
  return (value*1)
}
