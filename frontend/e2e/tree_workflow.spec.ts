import { test, expect } from '@playwright/test'

test.describe('Auth Page UI', () => {
  test('auth page has correct title', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByText('Agentic Tree')).toBeVisible()
  })

  test('auth page subtitle is visible', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByText(/AI-powered binary tree/i)).toBeVisible()
  })

  test('login tab is active by default', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
  })

  test('register tab shows name field', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await expect(page.getByPlaceholder('Your name')).toBeVisible()
    await expect(page.getByPlaceholder('Repeat password')).toBeVisible()
  })

  test('sign in button is present', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('create account button is present on register tab', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('switching tabs clears error', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/please fill in all fields/i)).toBeVisible()
    await page.getByRole('button', { name: 'Register' }).click()
    await expect(page.getByText(/please fill in all fields/i)).not.toBeVisible()
  })

  test('redirect to auth when not logged in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/auth/)
  })

  test('redirect to auth for workspace route', async ({ page }) => {
    await page.goto('/workspace/some-id')
    await expect(page).toHaveURL(/auth/)
  })

  test('unknown route redirects to auth', async ({ page }) => {
    await page.goto('/unknown-page')
    await expect(page).toHaveURL(/auth/)
  })
})
