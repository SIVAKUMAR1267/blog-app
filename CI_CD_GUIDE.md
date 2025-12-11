# GitHub Actions CI/CD Configuration for Playwright Tests

This file shows how to integrate Playwright tests with GitHub Actions for continuous integration.

## Setup Instructions

1. Create directory: `.github/workflows/`
2. Add the example workflow files below
3. Commit and push to your repository
4. Tests will run automatically on push/PR

## Example 1: Basic E2E Tests Workflow

Create `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npm run test:e2e
      
      - name: Upload blob report to GitHub Actions Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: blob-report-${{ matrix.node-version }}
          path: blob-report
          retention-days: 1
  
  merge-reports:
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Download blob reports from GitHub Actions Artifacts
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
      
      - name: Merge reports
        run: npx playwright merge-reports --reporter html ./all-blob-reports
      
      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        with:
          name: html-report-merged
          path: playwright-report
          retention-days: 14
```

## Example 2: Advanced Workflow with Multiple Browsers

Create `.github/workflows/e2e-advanced.yml`:

```yaml
name: E2E Tests - Multi Browser

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM

jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps ${{ matrix.browser }}
      
      - name: Run tests on ${{ matrix.browser }}
        run: npx playwright test --project=${{ matrix.browser }}
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.browser }}
          path: test-results/
          retention-days: 7
      
      - name: Upload playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 7
```

## Example 3: E2E Tests with UI Components

Create `.github/workflows/e2e-full.yml`:

```yaml
name: Full E2E Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm test

  e2e-tests:
    needs: [lint, unit-tests]
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Generate report
        if: always()
        run: npx playwright show-report
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Comment PR with results
        if: always() && github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const testResultsPath = 'playwright-report/index.html';
            
            if (fs.existsSync(testResultsPath)) {
              github.rest.issues.createComment({
                issue_number: context.issue.number,
                owner: context.repo.owner,
                repo: context.repo.repo,
                body: '✅ E2E tests completed! Check the artifacts for the full report.'
              });
            }
```

## Example 4: Scheduled Nightly Tests

Create `.github/workflows/nightly-e2e.yml`:

```yaml
name: Nightly E2E Tests

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger

jobs:
  nightly-tests:
    timeout-minutes: 120
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run all E2E tests
        run: npm run test:e2e
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: nightly-report
          path: playwright-report/
          retention-days: 7
      
      - name: Slack notification on failure
        if: failure()
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "❌ Nightly E2E tests failed!",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "Nightly E2E tests failed for repository ${{ github.repository }}"
                  }
                }
              ]
            }
```

## Local Testing Equivalent

To run tests locally with the same configuration as CI:

```bash
# Install everything
npm ci
npx playwright install --with-deps

# Run tests (same as CI)
npm run test:e2e

# View report
npx playwright show-report
```

## Environment Variables

Add secrets in GitHub Settings → Secrets and variables → Actions:

```yaml
# GitHub Actions secrets
SLACK_WEBHOOK      # Slack webhook for notifications
API_BASE_URL       # Custom API URL for testing
TEST_USERNAME      # Test user credentials
TEST_PASSWORD
```

Use in workflow:
```yaml
env:
  API_BASE_URL: ${{ secrets.API_BASE_URL }}
```

## Performance Optimization

### Parallel Execution
```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]

run: npx playwright test --shard=${{ matrix.shard }}/4
```

### Caching
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

- uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

## Troubleshooting

### Tests fail in CI but pass locally

1. **Increase timeout**:
   ```yaml
   timeout-minutes: 120
   ```

2. **Check dependencies**:
   ```bash
   npm ci  # Use exact versions
   npx playwright install --with-deps
   ```

3. **View logs**:
   - Download artifact reports from Actions
   - Check for headless browser issues

### Out of memory errors

Add more resources or use specific browser:
```bash
npx playwright test --project=chromium
```

## Notifications

### Slack Integration
```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

### Email Notifications
Configure in GitHub repository settings.

## Monitoring

### Check Action Status
- Go to Actions tab on GitHub
- View workflow runs and results
- Download artifacts (reports)

### View Test Reports
1. Go to Actions
2. Click on test run
3. Download "playwright-report" artifact
4. Extract and open `index.html`

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI/CD Guide](https://playwright.dev/docs/ci)
- [Actions Setup Node](https://github.com/actions/setup-node)
