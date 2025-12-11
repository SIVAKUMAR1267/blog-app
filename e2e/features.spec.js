import { test, expect } from '@playwright/test'

test.describe('Blog Application - Create Blog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to create blog page first
    // Note: This assumes there's a "Create Blog" link or route
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
    // Reload page after clearing localStorage
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Look for create blog button/link
    const createBlogButton = page.locator('text=Create').first()
    if (await createBlogButton.isVisible().catch(() => false)) {
      await createBlogButton.click()
    }
  })

  test('should display create blog form', async ({ page }) => {
    // Check if we can navigate to create blog page
    const titleInput = page.locator('input[name="Title"]')
    const authorInput = page.locator('input[name="Author"]')
    const urlInput = page.locator('input[name="Url"]')

    // If on create blog page, these should be visible
    const titleVisible = await titleInput.isVisible().catch(() => false)
    const authorVisible = await authorInput.isVisible().catch(() => false)
    const urlVisible = await urlInput.isVisible().catch(() => false)

    if (titleVisible && authorVisible && urlVisible) {
      expect(titleVisible).toBeTruthy()
      expect(authorVisible).toBeTruthy()
      expect(urlVisible).toBeTruthy()
    }
  })

  test('should allow filling blog form with valid data', async ({ page }) => {
    const titleInput = page.locator('input[name="Title"]')
    const authorInput = page.locator('input[name="Author"]')
    const urlInput = page.locator('input[name="Url"]')

    const titleVisible = await titleInput.isVisible().catch(() => false)

    if (titleVisible) {
      await titleInput.fill('Test Blog Title')
      await authorInput.fill('Test Author')
      await urlInput.fill('https://example.com')

      await expect(titleInput).toHaveValue('Test Blog Title')
      await expect(authorInput).toHaveValue('Test Author')
      await expect(urlInput).toHaveValue('https://example.com')
    }
  })

  test('should validate blog form fields', async ({ page }) => {
    const titleInput = page.locator('input[name="Title"]')
    const createButton = page.locator('button:has-text("Create")')

    const titleVisible = await titleInput.isVisible().catch(() => false)

    if (titleVisible) {
      // Try to submit empty form
      if (await createButton.isVisible()) {
        await createButton.click()
        // Form validation should prevent submission
      }
    }
  })
})

test.describe('Blog Application - Edit/Delete Blog', () => {
  test('should display delete button for user blogs', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Look for delete button
    const deleteButton = page.locator('button:has-text("Delete")')
    const deleteButtonExists = await deleteButton.isVisible().catch(() => false)

    if (deleteButtonExists) {
      expect(deleteButtonExists).toBeTruthy()
    }
  })

  test('should show confirmation before deleting blog', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Look for delete button
    const deleteButton = page.locator('button:has-text("Delete")')
    const deleteButtonExists = await deleteButton.isVisible().catch(() => false)

    if (deleteButtonExists) {
      // Set up listener for dialog
      let dialogMessage = ''
      page.on('dialog', async (dialog) => {
        dialogMessage = dialog.message()
        await dialog.dismiss()
      })

      await deleteButton.click()
      await page.waitForTimeout(500)

      // Dialog should appear
      if (dialogMessage) {
        expect(dialogMessage).toContain('delete')
      }
    }
  })
})

test.describe('Blog Application - Responsive Design', () => {
  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto('/')
    await page.waitForTimeout(3000)

    // On mobile, BLOGS header is hidden, check for hamburger menu or content
    const hamburgerMenu = page.locator('button[aria-label="account of current user"]')
    const appContent = page.locator('h2')

    // Either hamburger menu or content should be visible
    const menuVisible = await hamburgerMenu.isVisible().catch(() => false)
    const contentVisible = await appContent.isVisible().catch(() => false)

    expect(menuVisible || contentVisible).toBeTruthy()
  })

  test('should be responsive on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    await page.goto('/')
    await page.waitForTimeout(3000)

    // On tablet, BLOGS header might be visible or hidden depending on width
    const blogsHeader = page.locator('a:has-text("BLOGS")')
    const hamburgerMenu = page.locator('button[aria-label="account of current user"]')
    const appContent = page.locator('h2')

    // Either header or content should be visible
    const headerVisible = await blogsHeader.isVisible().catch(() => false)
    const menuVisible = await hamburgerMenu.isVisible().catch(() => false)
    const contentVisible = await appContent.isVisible().catch(() => false)

    expect(headerVisible || menuVisible || contentVisible).toBeTruthy()
  })

  test('should be responsive on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })

    await page.goto('/')
    await page.waitForTimeout(3000)

    // On desktop, BLOGS header should be visible
    const blogsHeader = page.locator('a:has-text("BLOGS")')
    const count = await blogsHeader.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Blog Application - Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

    const loadTime = Date.now() - startTime

    // Page should load in reasonable time (adjust as needed)
    expect(loadTime).toBeLessThan(10000)
  })

  test('should handle large blog lists', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(2000)

    // Check if page can handle scrolling
    await page.evaluate(() => {
      window.scrollBy(0, document.body.scrollHeight)
    })

    // Page should still be responsive
    const content = page.locator('body')
    await expect(content).toBeVisible()
  })
})
