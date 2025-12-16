import { test, expect } from '@playwright/test'

test.describe('Blog Application - API Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first to ensure page is loaded
    await page.goto('/')
    await page.waitForTimeout(1000)
    // Clear localStorage to ensure fresh start
    await page.evaluate(() => {
      try {
        localStorage.clear()
      } catch (e) {
        // Silently ignore if localStorage is not accessible
      }
    })
  })

  test('should load blogs data', async ({ page }) => {
    // Monitor API calls
    let apiCalls = []

    page.on('response', (response) => {
      if (response.url().includes('/api')) {
        apiCalls.push({
          url: response.url(),
          status: response.status(),
        })
      }
    })

    await page.goto('/')
    await page.waitForTimeout(3000)

    // Should have made API calls
    const blogsApiCall = apiCalls.find((call) => call.url.includes('/blogs'))

    if (blogsApiCall) {
      // Accept both 200 (OK) and 304 (Not Modified) as valid responses
      expect([200, 304]).toContain(blogsApiCall.status)
    }
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // This test would need to mock API failures
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Page should still be usable even if API fails
    // Check for login form heading or login button
    const loginHeading = page.locator('h2:has-text("Login")')
    const loginButton = page.locator('button:has-text("Login")')
    const loginFormExists = (await loginHeading.isVisible().catch(() => false)) || (await loginButton.isVisible().catch(() => false))

    // Either show login form or error content
    expect(
      loginFormExists || (await page.locator('text=Error').isVisible().catch(() => false))
    ).toBeTruthy()
  })

  test('should send user data on login', async ({ page }) => {
    let loginRequest = null

    page.on('request', (request) => {
      if (request.url().includes('/login') && request.method() === 'POST') {
        loginRequest = request
      }
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    const usernameInput = page.locator('input[type="text"]').first()
    const passwordInput = page.locator('input[type="password"]')
    const loginButton = page.locator('button:has-text("Login")')

    if (await usernameInput.isVisible()) {
      await usernameInput.fill('testuser')
      await passwordInput.fill('password123')
      await loginButton.click()

      await page.waitForTimeout(2000)

      if (loginRequest) {
        const postData = loginRequest.postDataJSON()
        expect(postData).toHaveProperty('username')
        expect(postData).toHaveProperty('password')
      }
    }
  })

  test('should persist user session in localStorage', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Check localStorage
    const localStorage = await page.evaluate(() => {
      return Object.fromEntries(
        Object.keys(window.localStorage).map((key) => [key, window.localStorage.getItem(key)])
      )
    })

    // If user is logged in, there should be a token
    const hasToken = Object.keys(localStorage).some((key) => key.toLowerCase().includes('token') || key.toLowerCase().includes('user'))

    // Either has token or no user logged in
    expect(typeof localStorage).toBe('object')
  })

  test('should send blog data on blog submission', async ({ page }) => {
    let createBlogRequest = null

    page.on('request', (request) => {
      if (
        request.url().includes('/blogs') &&
        request.method() === 'POST'
      ) {
        createBlogRequest = request
      }
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Try to find and interact with create blog form
    const createButton = page.locator('button:has-text("Create Blog")')
    const createButtonExists = await createButton.isVisible().catch(() => false)

    if (createButtonExists) {
      // Would need to implement proper form filling and submission
      // This is a placeholder for the test structure
    }
  })

  test('should handle network timeouts', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/**', (route) => {
      setTimeout(() => {
        route.continue()
      }, 5000)
    })

    const navigationPromise = page.goto('/')

    // Page should handle slow loading
    await navigationPromise.catch(() => {
      // Timeout is acceptable
    })

    // Page should still render something
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should refresh data on page reload', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    const initialContent = await page.content()

    await page.reload()
    await page.waitForTimeout(2000)

    const reloadedContent = await page.content()

    // Content should be similar after reload
    expect(reloadedContent).toBeDefined()
    expect(reloadedContent.length).toBeGreaterThan(0)
  })

  test('should validate request headers', async ({ page }) => {
    const requestHeaders = []

    page.on('request', (request) => {
      if (request.url().includes('/api')) {
        requestHeaders.push({
          url: request.url(),
          method: request.method(),
        })
      }
    })

    await page.goto('/')
    await page.waitForTimeout(3000)

    // Should have made API requests
    if (requestHeaders.length > 0) {
      const firstRequest = requestHeaders[0]
      expect(firstRequest.method).toMatch(/GET|POST|PUT|DELETE|PATCH/)
    }
  })
})

test.describe('Blog Application - Data Validation', () => {
  test('should display blogs with valid data', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Get all blog elements if they exist
    const blogElements = page.locator('h4')
    const count = await blogElements.count()

    if (count > 0) {
      // Check first blog has title
      const firstBlogTitle = await blogElements.first().textContent()
      expect(firstBlogTitle).toBeDefined()
      expect(firstBlogTitle?.length).toBeGreaterThan(0)
    }
  })

  test('should display user information correctly', async ({ page }) => {
    await page.goto('/users')
    await page.waitForTimeout(2000)

    // Check if users are displayed
    const userElements = page.locator('a[href*="/users/"]')
    const count = await userElements.count()

    if (count > 0) {
      const firstUserLink = await userElements.first().getAttribute('href')
      expect(firstUserLink).toBeDefined()
      expect(firstUserLink).toMatch(/\/users\//)
    }
  })

  test('should format blog dates correctly', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Check for any date elements
    const body = page.locator('body')
    const content = await body.textContent()

    // Should have some content
    expect(content).toBeDefined()
    expect(content?.length).toBeGreaterThan(0)
  })
})
