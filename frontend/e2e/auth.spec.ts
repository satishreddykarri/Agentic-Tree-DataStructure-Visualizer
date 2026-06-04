import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('auth page loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/auth/)
    await expect(page.getByText('Agentic Tree')).toBeVisible()
  })

  test('login and register tabs are visible', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible()
  })

  test('shows validation error for empty login form', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/please fill in all fields/i)).toBeVisible()
  })

  test('register form shows password mismatch error', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByPlaceholder('Your name').fill('Test User')
    await page.getByPlaceholder('you@example.com').fill('test@example.com')
    await page.getByPlaceholder('Min 6 characters').fill('password1')
    await page.getByPlaceholder('Repeat password').fill('password2')
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/passwords do not match/i)).toBeVisible()
  })

  test('short password shows error', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByPlaceholder('Your name').fill('Test User')
    await page.getByPlaceholder('you@example.com').fill('test@example.com')
    await page.getByPlaceholder('Min 6 characters').fill('abc')
    await page.getByPlaceholder('Repeat password').fill('abc')
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/password must be at least/i)).toBeVisible()
  })

  test('empty register form shows error', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page.getByText(/please fill in all fields/i)).toBeVisible()
  })
})
