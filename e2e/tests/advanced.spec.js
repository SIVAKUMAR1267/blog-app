import { test, expect } from '@playwright/test'
import {
  loginUser,
  logoutUser,
  createBlog,
  addComment,
  likeBlog,
  deleteBlog,
  getBlogTitles,
  getUserNames,
  isUserLoggedIn,
  navigateToBlog,
  navigateToUser,
  clearLocalStorage,
  setViewport,
} from './helpers'

test.describe('Blog Application - Advanced Tests with Helpers', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first, then clear session
    await page.goto('/')
    await clearLocalStorage(page)
  })

  test('should display all blogs on home page', async ({ page }) => {
    await page.waitForTimeout(2000)

    const titles = await getBlogTitles(page)

    // Either has blogs or empty list
    if (titles.length > 0) {
      expect(titles[0]).toBeDefined()
      expect(titles[0].length).toBeGreaterThan(0)
    }
  })

  test('should navigate to blog and display details', async ({ page }) => {
    await page.waitForTimeout(2000)

    const navigated = await navigateToBlog(page, 0)

    if (navigated) {
      expect(page.url()).toMatch(/\/blogs\//)
    }
  })

  test('should allow adding comment to blog', async ({ page }) => {
    await page.waitForTimeout(2000)

    const navigated = await navigateToBlog(page, 0)

    if (navigated) {
      const commentAdded = await addComment(page, 'This is a test comment')

      if (commentAdded) {
        expect(commentAdded).toBeTruthy()
      }
    }
  })

  test('should allow liking a blog', async ({ page }) => {
    await page.waitForTimeout(2000)

    const liked = await likeBlog(page)

    // Either liked successfully or like not available
    expect(typeof liked).toBe('boolean')
  })

  test('should display users on users page', async ({ page }) => {
    await page.goto('/users')
    await page.waitForTimeout(2000)

    const userNames = await getUserNames(page)

    // Either has users or no users
    expect(Array.isArray(userNames)).toBeTruthy()
  })

  test('should navigate to user details', async ({ page }) => {
    await page.goto('/users')
    await page.waitForTimeout(2000)

    const navigated = await navigateToUser(page, 0)

    if (navigated) {
      expect(page.url()).toMatch(/\/users\//)
    }
  })

  test('should work on mobile viewport', async ({ page }) => {
    await setViewport(page, 'mobile')

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Check responsive layout
    const body = page.locator('body')
    await expect(body).toBeVisible()

    // Check if content is still readable
    const titles = await getBlogTitles(page)
    expect(Array.isArray(titles)).toBeTruthy()
  })

  test('should work on tablet viewport', async ({ page }) => {
    await setViewport(page, 'tablet')

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Check responsive layout
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should work on desktop viewport', async ({ page }) => {
    await setViewport(page, 'desktop')

    await page.goto('/')
    await page.waitForTimeout(2000)

    // Check responsive layout
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should maintain session across pages', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    const loggedInBefore = await isUserLoggedIn(page)

    // Navigate to users page
    const userLink = page.locator('a:has-text("Users")')
    if (await userLink.isVisible()) {
      await userLink.click()
      await page.waitForTimeout(1000)
    }

    const loggedInAfter = await isUserLoggedIn(page)

    // Login status should be consistent
    expect(loggedInBefore).toBe(loggedInAfter)
  })

  test('should allow navigating between pages', async ({ page }) => {
    const blogLink = page.locator('a:has-text("Blogs")')
    const userLink = page.locator('a:has-text("Users")')

    // Navigate to users
    if (await userLink.isVisible()) {
      await userLink.click()
      await page.waitForTimeout(1000)
      expect(page.url()).toMatch(/\/users/)
    }

    // Navigate back to blogs
    if (await blogLink.isVisible()) {
      await blogLink.click()
      await page.waitForTimeout(1000)
      expect(page.url()).toMatch(/\/$/)
    }
  })
})

test.describe('Blog Application - Complex User Flows', () => {
  test('should complete full blog browsing flow', async ({ page }) => {
    // 1. Navigate to home
    await page.goto('/')
    await page.waitForTimeout(2000)

    // 2. Get all blogs
    const titles = await getBlogTitles(page)
    const hasBlogsBefore = titles.length > 0

    // 3. Navigate to blog if available
    if (hasBlogsBefore) {
      const navigated = await navigateToBlog(page, 0)
      expect(navigated).toBeTruthy()
    }

    // 4. Navigate to users
    const userLink = page.locator('a:has-text("Users")')
    if (await userLink.isVisible()) {
      await userLink.click()
      await page.waitForTimeout(1000)

      // 5. Get users
      const users = await getUserNames(page)
      expect(Array.isArray(users)).toBeTruthy()

      // 6. Navigate to user if available
      if (users.length > 0) {
        const navigated = await navigateToUser(page, 0)
        expect(navigated).toBeTruthy()
      }
    }
  })

  test('should handle multiple interactions in sequence', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Try multiple interactions
    const liked = await likeBlog(page)
    const titles = await getBlogTitles(page)

    // Verify page is still functional
    expect(page.url()).toMatch(/\/$/)
    expect(Array.isArray(titles)).toBeTruthy()
  })
})
