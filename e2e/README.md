# Playwright E2E Tests

This directory contains end-to-end (E2E) tests for the Blog Application using Playwright.

## Setup

### Installation

The Playwright package is already added to the project's devDependencies. Install it along with browser binaries:

```bash
npm install
npx playwright install
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run tests with visible browser
```bash
npm run test:e2e:headed
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.js
```

### Run tests for specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Files

### 1. **auth.spec.js** - Authentication Tests
- Login form visibility
- Signup form navigation
- Form field population
- Login error handling
- Navigation links

### 2. **blogs.spec.js** - Blog Management Tests
- Blog list display
- Blog details navigation
- Comment form functionality
- Adding comments
- Like functionality
- Users list and user details

### 3. **features.spec.js** - Feature Tests
- Create blog form
- Edit/Delete blog functionality
- Delete confirmation dialog
- Responsive design (mobile, tablet, desktop)
- Performance metrics
- Large list handling

## Configuration

The Playwright configuration is defined in `playwright.config.js`:

- **baseURL**: `http://localhost:3000` (adjust if your app runs on a different port)
- **browsers**: Chromium, Firefox, WebKit
- **reporters**: HTML report (open with `npx playwright show-report`)
- **webServer**: Automatically starts the app with `npm run start`

## Writing Tests

### Basic Structure
```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Group', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/')
  })

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('text=Something')).toBeVisible()
  })
})
```

### Common Assertions
```javascript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Values
await expect(input).toHaveValue('expected')

// URLs
await expect(page).toHaveURL('/path')

// Text content
await expect(page.locator('text=Hello')).toBeVisible()

// Counts
expect(await elements.count()).toBeGreaterThan(0)
```

### Common Actions
```javascript
// Navigation
await page.goto('/')
await page.click('text=Button')
await page.fill('input[type="text"]', 'value')

// Waiting
await page.waitForTimeout(2000)
await page.waitForLoadState('networkidle')

// Getting values
const value = await input.inputValue()
const text = await element.textContent()
```

## Best Practices

1. **Use data-testid attributes** - Add `data-testid` attributes to elements for more reliable selectors
2. **Wait for network** - Use `waitForLoadState('networkidle')` for async operations
3. **Error handling** - Use `.catch(() => false)` for optional elements
4. **Clear test names** - Write descriptive test names
5. **Isolate tests** - Each test should be independent
6. **Use Page Objects** - Create helper functions for common operations

## Debugging

### View Test Trace
```bash
npx playwright show-trace trace.zip
```

### Step through tests
```bash
npx playwright test --debug
```

### Generate report
```bash
npx playwright test
npx playwright show-report
```

## CI/CD Integration

The tests are configured to run in CI environments:
- Runs on a single worker in CI
- Retries tests 2 times on failure
- Captures traces on first retry

## Troubleshooting

### Tests fail in CI but pass locally
- Increase timeouts in CI
- Ensure app is running on correct port
- Check for flaky selectors (use data-testid instead)

### Browser download issues
```bash
npx playwright install --with-deps
```

### Port already in use
```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# macOS/Linux: lsof -i :3000
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
