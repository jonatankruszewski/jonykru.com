import { expect, test } from '@playwright/test'

/**
 * UI tests for the website
 */

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test and set dark theme preference
    await page.addInitScript(() => {
      localStorage.clear()
      // Set dark as default to ensure consistent tests
      localStorage.setItem('theme', 'dark')
    })
  })

  test('should show theme toggle button', async ({ page }) => {
    await page.goto('/')

    // Wait for the theme toggle button to be visible
    const themeButton = page.getByRole('button', { name: /switch to/i })
    await expect(themeButton).toBeVisible({ timeout: 10000 })
  })

  test('should toggle theme when clicking the button', async ({ page }) => {
    await page.goto('/')

    // Wait for initial load and get the theme button
    const themeButton = page.getByRole('button', { name: /switch to/i })
    await expect(themeButton).toBeVisible({ timeout: 10000 })

    // Get initial aria-label
    const initialLabel = await themeButton.getAttribute('aria-label')

    // Click to toggle theme
    await themeButton.click()

    // Wait for the label to change
    await page.waitForTimeout(500)

    // Get the new aria-label
    const newLabel = await themeButton.getAttribute('aria-label')

    // Labels should be different after toggle
    expect(newLabel).not.toBe(initialLabel)
  })

  test('should change body background color when toggling', async ({
    page
  }) => {
    await page.goto('/')

    const themeButton = page.getByRole('button', { name: /switch to/i })
    await expect(themeButton).toBeVisible({ timeout: 10000 })

    // Get initial background color
    const initialBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    )

    // Click to toggle
    await themeButton.click()
    await page.waitForTimeout(500)

    // Get new background color
    const newBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    )

    // Background color should change
    expect(newBg).not.toBe(initialBg)
  })

  test('should persist theme preference in localStorage', async ({ page }) => {
    await page.goto('/')

    const themeButton = page.getByRole('button', { name: /switch to/i })
    await expect(themeButton).toBeVisible({ timeout: 10000 })

    // Toggle the theme
    await themeButton.click()
    await page.waitForTimeout(500)

    // Check localStorage has theme value
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBeTruthy()
    expect(['light', 'dark']).toContain(theme)

    // Reload the page
    await page.reload()
    await page.waitForTimeout(1000)

    // Check theme is still applied (button should still be visible)
    await expect(page.getByRole('button', { name: /switch to/i })).toBeVisible()
  })

  test('should toggle html dark class', async ({ page }) => {
    await page.goto('/')

    const themeButton = page.getByRole('button', { name: /switch to/i })
    await expect(themeButton).toBeVisible({ timeout: 10000 })

    // Get initial dark class state
    const initialHasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )

    // Toggle theme
    await themeButton.click()
    await page.waitForTimeout(500)

    // Check dark class state changed
    const newHasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark')
    )

    expect(newHasDark).not.toBe(initialHasDark)
  })
})

test.describe('Navigation', () => {
  test('should have all navigation links visible', async ({ page }) => {
    await page.goto('/')

    // Check that main nav links exist
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible()
    await expect(
      page.getByRole('link', { name: /publications/i })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /certifications/i })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible()
  })

  test('should scroll to sections when nav links are clicked', async ({
    page
  }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    // Click on certifications link
    await page
      .getByRole('link', { name: /certifications/i })
      .first()
      .click()
    await page.waitForTimeout(500)

    // Check that certifications section is in view
    const certificationsSection = page.locator('#certifications')
    await expect(certificationsSection).toBeInViewport()
  })
})

test.describe('Sections Content', () => {
  test('should display publications section with articles', async ({
    page
  }) => {
    await page.goto('/')

    // Check publications heading exists
    await expect(
      page.getByRole('heading', { name: /latest publications/i })
    ).toBeVisible()

    // Check that at least one publication card exists
    const publicationCards = page.locator('#publications ul li')
    await expect(publicationCards.first()).toBeVisible()
  })

  test('should display certifications section with badges', async ({
    page
  }) => {
    await page.goto('/')

    // Check certifications heading exists
    await expect(
      page.getByRole('heading', { name: /certifications/i })
    ).toBeVisible()

    // Check that at least one certification card exists
    const certificationCards = page.locator('#certifications ul li')
    await expect(certificationCards.first()).toBeVisible()
  })

  test('should display contact section with email form', async ({ page }) => {
    await page.goto('/')

    // Check contact section exists
    const contactSection = page.locator('#contact')
    await expect(contactSection).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test('should have proper page title', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/jonatan kruszewski/i)
  })

  test('theme toggle button should have accessible label', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(500)

    const themeButton = page.getByRole('button', { name: /switch to/i })
    await expect(themeButton).toHaveAttribute('aria-label')
    await expect(themeButton).toHaveAttribute('title')
  })
})
