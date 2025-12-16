/**
 * Playwright Test Helpers and Utilities
 * Common functions to use across test files
 */

/**
 * Login a user
 * @param {Page} page - Playwright page object
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Promise<boolean>} - True if login was successful
 */
export async function loginUser(page, username, password) {
  try {
    await page.goto('/')
    await page.waitForTimeout(1000)

    const usernameInput = page.locator('input[type="text"]').first()
    const passwordInput = page.locator('input[type="password"]')
    const loginButton = page.locator('button:has-text("Login")')

    await usernameInput.fill(username)
    await passwordInput.fill(password)
    await loginButton.click()

    // Wait for navigation or page update
    await page.waitForTimeout(2000)

    return true
  } catch (error) {
    console.error('Login failed:', error)
    return false
  }
}

/**
 * Logout a user
 * @param {Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if logout was successful
 */
export async function logoutUser(page) {
  try {
    // Look for logout button (usually in user menu)
    const logoutButton = page.locator('button:has-text("Logout")')
    const logoutMenuOption = page.locator('text=Logout')

    if (await logoutButton.isVisible()) {
      await logoutButton.click()
    } else if (await logoutMenuOption.isVisible()) {
      await logoutMenuOption.click()
    }

    await page.waitForTimeout(1000)
    return true
  } catch (error) {
    console.error('Logout failed:', error)
    return false
  }
}

/**
 * Create a new blog
 * @param {Page} page - Playwright page object
 * @param {string} title - Blog title
 * @param {string} author - Blog author
 * @param {string} url - Blog URL
 * @returns {Promise<boolean>} - True if blog creation was successful
 */
export async function createBlog(page, title, author, url) {
  try {
    // Navigate to create blog page
    await page.goto('/')
    await page.waitForTimeout(1000)

    const createButton = page.locator('button:has-text("Create")').first()
    if (await createButton.isVisible()) {
      await createButton.click()
      await page.waitForTimeout(1000)
    }

    // Fill form
    const titleInput = page.locator('input[name="Title"]')
    const authorInput = page.locator('input[name="Author"]')
    const urlInput = page.locator('input[name="Url"]')

    if (await titleInput.isVisible()) {
      await titleInput.fill(title)
      await authorInput.fill(author)
      await urlInput.fill(url)

      const submitButton = page.locator('button:has-text("Create")')
      await submitButton.click()

      await page.waitForTimeout(2000)
      return true
    }

    return false
  } catch (error) {
    console.error('Blog creation failed:', error)
    return false
  }
}

/**
 * Add a comment to a blog
 * @param {Page} page - Playwright page object
 * @param {string} comment - Comment text
 * @returns {Promise<boolean>} - True if comment was added
 */
export async function addComment(page, comment) {
  try {
    const commentInput = page.locator('input[name="comments"]')

    if (await commentInput.isVisible()) {
      await commentInput.fill(comment)

      const submitButton = page.locator('button:has-text("add comment")')
      await submitButton.click()

      await page.waitForTimeout(1000)
      return true
    }

    return false
  } catch (error) {
    console.error('Comment addition failed:', error)
    return false
  }
}

/**
 * Like a blog
 * @param {Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if like was successful
 */
export async function likeBlog(page) {
  try {
    const likeButton = page.locator('button:has-text("like")').first()

    if (await likeButton.isVisible()) {
      await likeButton.click()
      await page.waitForTimeout(500)
      return true
    }

    return false
  } catch (error) {
    console.error('Like failed:', error)
    return false
  }
}

/**
 * Delete a blog
 * @param {Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if blog was deleted
 */
export async function deleteBlog(page) {
  try {
    const deleteButton = page.locator('button:has-text("Delete")').first()

    if (await deleteButton.isVisible()) {
      // Listen for confirmation dialog
      page.on('dialog', async (dialog) => {
        if (dialog.type() === 'confirm') {
          await dialog.accept()
        }
      })

      await deleteButton.click()
      await page.waitForTimeout(1000)
      return true
    }

    return false
  } catch (error) {
    console.error('Delete failed:', error)
    return false
  }
}

/**
 * Wait for element to appear
 * @param {Page} page - Playwright page object
 * @param {string} selector - CSS selector or text
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} - True if element appeared
 */
export async function waitForElement(page, selector, timeout = 5000) {
  try {
    let element

    // Try to select by text first
    if (selector.includes('text=')) {
      element = page.locator(selector)
    } else {
      element = page.locator(selector)
    }

    await element.waitFor({ state: 'visible', timeout })
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get all blog titles from the page
 * @param {Page} page - Playwright page object
 * @returns {Promise<string[]>} - Array of blog titles
 */
export async function getBlogTitles(page) {
  try {
    const blogElements = page.locator('h4')
    const count = await blogElements.count()
    const titles = []

    for (let i = 0; i < count; i++) {
      const title = await blogElements.nth(i).textContent()
      if (title) {
        titles.push(title.trim())
      }
    }

    return titles
  } catch (error) {
    console.error('Error getting blog titles:', error)
    return []
  }
}

/**
 * Get all user names from users page
 * @param {Page} page - Playwright page object
 * @returns {Promise<string[]>} - Array of user names
 */
export async function getUserNames(page) {
  try {
    const userLinks = page.locator('a[href*="/users/"]')
    const count = await userLinks.count()
    const names = []

    for (let i = 0; i < count; i++) {
      const name = await userLinks.nth(i).textContent()
      if (name) {
        names.push(name.trim())
      }
    }

    return names
  } catch (error) {
    console.error('Error getting user names:', error)
    return []
  }
}

/**
 * Check if user is logged in
 * @param {Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if user is logged in
 */
export async function isUserLoggedIn(page) {
  try {
    const loginForm = page.locator('text=Login')
    const isLoggedOut = await loginForm.isVisible().catch(() => false)

    return !isLoggedOut
  } catch (error) {
    return false
  }
}

/**
 * Navigate to blog detail page
 * @param {Page} page - Playwright page object
 * @param {number} index - Index of blog to click (0-based)
 * @returns {Promise<boolean>} - True if navigation was successful
 */
export async function navigateToBlog(page, index = 0) {
  try {
    const blogLinks = page.locator('a[href*="/blogs/"]')

    if ((await blogLinks.count()) > index) {
      await blogLinks.nth(index).click()
      await page.waitForTimeout(1000)
      return true
    }

    return false
  } catch (error) {
    console.error('Blog navigation failed:', error)
    return false
  }
}

/**
 * Navigate to user detail page
 * @param {Page} page - Playwright page object
 * @param {number} index - Index of user to click (0-based)
 * @returns {Promise<boolean>} - True if navigation was successful
 */
export async function navigateToUser(page, index = 0) {
  try {
    const userLinks = page.locator('a[href*="/users/"]')

    if ((await userLinks.count()) > index) {
      await userLinks.nth(index).click()
      await page.waitForTimeout(1000)
      return true
    }

    return false
  } catch (error) {
    console.error('User navigation failed:', error)
    return false
  }
}

/**
 * Clear local storage
 * @param {Page} page - Playwright page object
 */
export async function clearLocalStorage(page) {
  try {
    await page.evaluate(() => {
      try {
        localStorage.clear()
      } catch (e) {
        // Silently ignore if localStorage is not accessible
      }
    })
  } catch (e) {
    // Silently ignore if page context doesn't support localStorage
  }
}

/**
 * Get local storage item
 * @param {Page} page - Playwright page object
 * @param {string} key - Storage key
 * @returns {Promise<string|null>} - Storage value or null
 */
export async function getLocalStorageItem(page, key) {
  try {
    return await page.evaluate(
      (k) => {
        try {
          return localStorage.getItem(k)
        } catch (e) {
          return null
        }
      },
      key
    )
  } catch (e) {
    return null
  }
}

/**
 * Set viewport size
 * @param {Page} page - Playwright page object
 * @param {string} device - Device type: 'mobile', 'tablet', 'desktop'
 */
export async function setViewport(page, device = 'desktop') {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  }

  await page.setViewportSize(viewports[device] || viewports.desktop)
}

/**
 * Take a screenshot
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot file name
 */
export async function takeScreenshot(page, name) {
  await page.screenshot({ path: `screenshots/${name}.png` })
}

export default {
  loginUser,
  logoutUser,
  createBlog,
  addComment,
  likeBlog,
  deleteBlog,
  waitForElement,
  getBlogTitles,
  getUserNames,
  isUserLoggedIn,
  navigateToBlog,
  navigateToUser,
  clearLocalStorage,
  getLocalStorageItem,
  setViewport,
  takeScreenshot,
}
