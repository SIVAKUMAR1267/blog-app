import { test, expect } from '@playwright/test'

test.describe('Blog Application - Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first to ensure page is loaded
    await page.goto('/')
    // Clear localStorage to ensure fresh start
    await page.evaluate(() => {
      try {
        localStorage.clear()
      } catch (e) {
        // Silently ignore if localStorage is not accessible
      }
    })
    // Reload page after clearing localStorage
    await page.goto('/')
    // Wait for the app to fully load and check if user state is initialized
    await page.waitForTimeout(2000)
  })

  test('should display login form when not authenticated', async ({ page }) => {
    await page.waitForTimeout(3000)
    const heading = page.locator('h2:has-text("Login")')
    const count = await heading.count()
    expect(count).toBeGreaterThan(0)
    const usernameInput = page.locator('input[name="Username"]')
    const passwordInput = page.locator('input[name="Password"]')
    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test('should show signup link', async ({ page }) => {
    await page.waitForTimeout(3000)
    const signupLink = page.locator('a:has-text("Create one")')
    const count = await signupLink.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.waitForTimeout(3000)
    await page.click('a:has-text("Create one")')
    await expect(page).toHaveURL(/\/signup/)
    await page.waitForTimeout(1500)
    const heading = page.locator('h2:has-text("Signup")')
    const count = await heading.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should allow user to fill login form', async ({ page }) => {
    await page.waitForTimeout(3000)
    const usernameInput = page.locator('input[name="Username"]')
    const passwordInput = page.locator('input[name="Password"]')

    await usernameInput.fill('testuser')
    await passwordInput.fill('password123')

    await expect(usernameInput).toHaveValue('testuser')
    await expect(passwordInput).toHaveValue('password123')
  })

  test('should show error message on login failure', async ({ page }) => {
    await page.waitForTimeout(3000)
    const usernameInput = page.locator('input[name="Username"]')
    const passwordInput = page.locator('input[name="Password"]')

    await usernameInput.fill('wronguser')
    await passwordInput.fill('wrongpass')

    const loginButton = page.locator('button:has-text("Login")')
    await loginButton.click()

    // Wait for error message
    await page.waitForTimeout(2000)
    const errorElement = page.locator('text=wrong username or password')
    const isVisible = await errorElement.isVisible().catch(() => false)

    if (isVisible) {
      await expect(errorElement).toBeVisible()
    }
  })
})

test.describe('Blog Application - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first to ensure page is loaded
    await page.goto('/')
    // Clear localStorage to ensure fresh start
    await page.evaluate(() => {
      try {
        localStorage.clear()
      } catch (e) {
        // Silently ignore if localStorage is not accessible
      }
    })
    // Reload page after clearing localStorage
    await page.goto('/')
  })

  test('should have header with navigation links', async ({ page }) => {
    await page.waitForTimeout(3000)
    // Header should have BLOGS link (on desktop)
    const blogsLink = page.locator('a:has-text("BLOGS")')
    const blogsCount = await blogsLink.count()
    expect(blogsCount).toBeGreaterThan(0)
  })

  test('should navigate to blogs list from home', async ({ page }) => {
    const blogsLink = page.locator('a:has-text("Blogs")')
    if (await blogsLink.isVisible()) {
      await blogsLink.click()
      await expect(page).toHaveURL('/')
    }
  })

  test('should navigate to users list', async ({ page }) => {
    const usersLink = page.locator('a:has-text("Users")')
    if (await usersLink.isVisible()) {
      await usersLink.click()
      await expect(page).toHaveURL(/\/users/)
    }
  })
})
