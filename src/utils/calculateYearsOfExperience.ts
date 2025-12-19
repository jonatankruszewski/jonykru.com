/**
 * Calculates years of experience from April 2019
 * @param referenceDate - Optional date to calculate from (defaults to current date)
 * @returns The number of years of experience (minimum 0)
 * @throws {Error} If referenceDate is an invalid date
 */
export const calculateYearsOfExperience = (
  referenceDate: Date = new Date()
): number => {
  // Validate input date
  if (!(referenceDate instanceof Date) || isNaN(referenceDate.getTime())) {
    throw new Error(
      'Invalid date provided. referenceDate must be a valid Date object.'
    )
  }

  const startDate = new Date(2019, 3, 1) // April 2019 (month is 0-indexed, so 3 = April)

  const yearDiff = referenceDate.getFullYear() - startDate.getFullYear()
  const monthDiff = referenceDate.getMonth() - startDate.getMonth()
  const dayDiff = referenceDate.getDate() - startDate.getDate()

  // If we haven't reached April 1st yet this year, subtract 1
  const hasReachedAnniversary =
    monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)

  // Return 0 for dates before the start date (no negative years)
  return Math.max(
    0,
    hasReachedAnniversary ? yearDiff : yearDiff - 1
  )
}

