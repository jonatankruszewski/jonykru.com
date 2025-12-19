import { describe, expect, it } from 'vitest'
import { calculateYearsOfExperience } from './calculateYearsOfExperience'

describe('calculateYearsOfExperience', () => {
  it('should return 0 for dates before April 2019', () => {
    const dateBefore = new Date(2019, 2, 31) // March 31, 2019
    expect(calculateYearsOfExperience(dateBefore)).toBe(0)
  })

  it('should return 0 for April 1, 2019', () => {
    const startDate = new Date(2019, 3, 1) // April 1, 2019
    expect(calculateYearsOfExperience(startDate)).toBe(0)
  })

  it('should return 0 for dates in April 2019 before the anniversary', () => {
    const dateInApril = new Date(2019, 3, 15) // April 15, 2019
    expect(calculateYearsOfExperience(dateInApril)).toBe(0)
  })

  it('should return 1 for April 1, 2020', () => {
    const oneYearLater = new Date(2020, 3, 1) // April 1, 2020
    expect(calculateYearsOfExperience(oneYearLater)).toBe(1)
  })

  it('should return 1 for dates after April 1, 2020 but before April 1, 2021', () => {
    const dateIn2020 = new Date(2020, 5, 15) // June 15, 2020
    expect(calculateYearsOfExperience(dateIn2020)).toBe(1)
  })

  it('should return 0 for dates in March 2020 (before anniversary)', () => {
    const dateBeforeAnniversary = new Date(2020, 2, 31) // March 31, 2020
    expect(calculateYearsOfExperience(dateBeforeAnniversary)).toBe(0)
  })

  it('should return 6 for April 1, 2025', () => {
    const sixYearsLater = new Date(2025, 3, 1) // April 1, 2025
    expect(calculateYearsOfExperience(sixYearsLater)).toBe(6)
  })

  it('should return 6 for dates after April 1, 2025 but before April 1, 2026', () => {
    const dateIn2025 = new Date(2025, 11, 19) // December 19, 2025
    expect(calculateYearsOfExperience(dateIn2025)).toBe(6)
  })

  it('should return 7 for April 1, 2026', () => {
    const sevenYearsLater = new Date(2026, 3, 1) // April 1, 2026
    expect(calculateYearsOfExperience(sevenYearsLater)).toBe(7)
  })

  it('should return 7 for dates after April 1, 2026', () => {
    const dateAfter = new Date(2026, 5, 15) // June 15, 2026
    expect(calculateYearsOfExperience(dateAfter)).toBe(7)
  })

  it('should return 10 for April 1, 2029', () => {
    const tenYearsLater = new Date(2029, 3, 1) // April 1, 2029
    expect(calculateYearsOfExperience(tenYearsLater)).toBe(10)
  })

  it('should handle edge case: last day before anniversary', () => {
    const lastDayBefore = new Date(2025, 2, 31) // March 31, 2025
    expect(calculateYearsOfExperience(lastDayBefore)).toBe(5)
  })

  it('should handle edge case: first day of anniversary month', () => {
    const firstDay = new Date(2025, 3, 1) // April 1, 2025
    expect(calculateYearsOfExperience(firstDay)).toBe(6)
  })

  it('should use current date when no reference date is provided', () => {
    const result = calculateYearsOfExperience()
    const currentDate = new Date()
    const expectedYear = currentDate.getFullYear() - 2019
    const monthDiff = currentDate.getMonth() - 3 // April is month 3
    const dayDiff = currentDate.getDate() - 1
    const hasReachedAnniversary =
      monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)
    const expected = hasReachedAnniversary ? expectedYear : expectedYear - 1

    expect(result).toBe(expected)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('should handle leap year correctly', () => {
    const leapYearDate = new Date(2024, 2, 29) // February 29, 2024 (before anniversary)
    expect(calculateYearsOfExperience(leapYearDate)).toBe(4)

    const afterLeapYear = new Date(2024, 3, 1) // April 1, 2024
    expect(calculateYearsOfExperience(afterLeapYear)).toBe(5)
  })

  it('should throw error for invalid date', () => {
    const invalidDate = new Date('invalid')
    expect(() => calculateYearsOfExperience(invalidDate)).toThrow(
      'Invalid date provided'
    )
  })

  it('should throw error for non-Date input', () => {
    expect(() =>
      calculateYearsOfExperience('2025-01-01' as unknown as Date)
    ).toThrow('Invalid date provided')
  })

  it('should handle far future dates gracefully', () => {
    const farFuture = new Date(2100, 5, 15) // June 15, 2100
    const result = calculateYearsOfExperience(farFuture)
    expect(result).toBe(81) // 2100 - 2019 = 81, but we subtract 1 if before April
    expect(result).toBeGreaterThan(0)
  })

  it('should handle dates very close to start date', () => {
    const justBefore = new Date(2019, 3, 0, 23, 59, 59) // March 31, 2019 23:59:59
    expect(calculateYearsOfExperience(justBefore)).toBe(0)

    const exactlyStart = new Date(2019, 3, 1, 0, 0, 0) // April 1, 2019 00:00:00
    expect(calculateYearsOfExperience(exactlyStart)).toBe(0)
  })
})

