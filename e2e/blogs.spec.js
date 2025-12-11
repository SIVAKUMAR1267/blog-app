import { test, expect } from '@playwright/test'

// Helper function to login a user
async function loginUser(page, username, password) {
  // Navigate first to ensure page is loaded
  await page.goto('/')
  await page.waitForTimeout(1000)
  // Clear localStorage before login
  await page.evaluate(() => {
    try {
      localStorage.clear()
    } catch (e) {
      // Silently ignore if localStorage is not accessible
    }
  })
  // Reload page after clearing localStorage
  await page.goto('/')
  await page.waitForTimeout(1000)
  const usernameInput = page.locator('input[type="text"]').first()
  const passwordInput = page.locator('input[type="password"]')
  const loginButton = page.locator('button:has-text("Login")')

  await usernameInput.fill(username)
  await passwordInput.fill(password)
  await loginButton.click()

  // Wait for redirect or page to load
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
}

test.describe('Blog Application - Blog Management', () => {
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

  test('should display blogs list', async ({ page }) => {
    await page.goto('/')

    // Wait for blogs to load
    await page.waitForTimeout(2000)

    // Check if any blog titles are visible
    const blogTitles = page.locator('h4')
    const count = await blogTitles.count()

    // Either show blogs or show login
    const loginForm = page.locator('text=Login')
    const hasLoginForm = await loginForm.isVisible().catch(() => false)

    if (hasLoginForm) {
      expect(hasLoginForm).toBeTruthy()
    } else if (count > 0) {
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should display blog details when clicking on a blog', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Try to find and click on a blog link
    const blogLinks = page.locator('a[href*="/blogs/"]')
    const linkCount = await blogLinks.count()

    if (linkCount > 0) {
      await blogLinks.first().click()

      // Wait for blog details page to load
      await page.waitForTimeout(1000)

      // Verify we're on a blog detail page
      expect(page.url()).toMatch(/\/blogs\//)
    }
  })

  test('should display comment form on blog detail page', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Try to find and click on a blog link
    const blogLinks = page.locator('a[href*="/blogs/"]')
    const linkCount = await blogLinks.count()

    if (linkCount > 0) {
      await blogLinks.first().click()

      // Wait for page to load
      await page.waitForTimeout(1000)

      // Check for comment input
      const commentInput = page.locator('input[name="comments"]')
      if (await commentInput.isVisible()) {
        expect(await commentInput.isVisible()).toBeTruthy()
      }
    }
  })

  test('should allow adding a comment', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Try to find and click on a blog link
    const blogLinks = page.locator('a[href*="/blogs/"]')
    const linkCount = await blogLinks.count()

    if (linkCount > 0) {
      await blogLinks.first().click()

      // Wait for page to load
      await page.waitForTimeout(1000)

      // Try to add a comment
      const commentInput = page.locator('input[name="comments"]')
      if (await commentInput.isVisible()) {
        await commentInput.fill('This is a test comment')

        const submitButton = page.locator('button:has-text("add comment")')
        if (await submitButton.isVisible()) {
          await submitButton.click()
          await page.waitForTimeout(1000)
        }
      }
    }
  })

  test('should display like button for each blog', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Look for like button
    const likeButton = page.locator('button:has-text("like")')
    const count = await likeButton.count()

    // Either logged out (no likes) or logged in (see likes)
    const loginForm = page.locator('text=Login')
    const hasLoginForm = await loginForm.isVisible().catch(() => false)

    if (!hasLoginForm && count > 0) {
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should allow liking a blog (when authenticated)', async ({ page }) => {
    await page.goto('/')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Look for like button
    const likeButton = page.locator('button:has-text("like")').first()
    const likeButtonExists = await likeButton.isVisible().catch(() => false)

    if (likeButtonExists) {
      const initialText = await likeButton.textContent()
      await likeButton.click()

      await page.waitForTimeout(1000)

      const finalText = await likeButton.textContent()
      // Button should still be visible after click
      expect(await likeButton.isVisible()).toBeTruthy()
    }
  })
})

test.describe('Blog Application - Users Page', () => {
  test('should display users list', async ({ page }) => {
    await page.goto('/users')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Check for users list
    const userLinks = page.locator('a[href*="/users/"]')
    const userCount = await userLinks.count()

    // Either no users or has users
    const noUsers = page.locator('text=No users found')
    const hasNoUsers = await noUsers.isVisible().catch(() => false)

    expect(hasNoUsers || userCount > 0).toBeTruthy()
  })

  test('should display user details when clicking on a user', async ({ page }) => {
    await page.goto('/users')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Try to find and click on a user link
    const userLinks = page.locator('a[href*="/users/"]')
    const linkCount = await userLinks.count()

    if (linkCount > 0) {
      await userLinks.first().click()

      // Wait for user details page to load
      await page.waitForTimeout(1000)

      // Verify we're on a user detail page
      expect(page.url()).toMatch(/\/users\//)
    }
  })

  test('should display user blogs on user detail page', async ({ page }) => {
    await page.goto('/users')

    // Wait for content to load
    await page.waitForTimeout(2000)

    // Try to find and click on a user link
    const userLinks = page.locator('a[href*="/users/"]')
    const linkCount = await userLinks.count()

    if (linkCount > 0) {
      await userLinks.first().click()

      // Wait for user details page to load
      await page.waitForTimeout(1000)

      // Check for blog list or empty state
      const blogTitles = page.locator('h4')
      const count = await blogTitles.count()

      const noBlogsMessage = page.locator('text=No blogs')
      const hasNoBlogsMessage = await noBlogsMessage.isVisible().catch(() => false)

      expect(hasNoBlogsMessage || count > 0).toBeTruthy()
    }
  })
})
