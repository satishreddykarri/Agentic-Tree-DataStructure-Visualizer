import { test, expect } from '@playwright/test'

const timestamp = Date.now()
const testPassword = 'testpassword123'

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

  test('successful registration redirects to dashboard', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByPlaceholder('Your name').fill(`User_${timestamp}`)
    await page.getByPlaceholder('you@example.com').fill(`user_${timestamp}@test.com`)
    await page.getByPlaceholder('Min 6 characters').fill(testPassword)
    await page.getByPlaceholder('Repeat password').fill(testPassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })
  })

  test('dashboard shows New Session button after login', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByPlaceholder('Your name').fill(`DashUser_${timestamp}`)
    await page.getByPlaceholder('you@example.com').fill(`dashuser_${timestamp}@test.com`)
    await page.getByPlaceholder('Min 6 characters').fill(testPassword)
    await page.getByPlaceholder('Repeat password').fill(testPassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })
    await expect(page.getByRole('button', { name: /new session/i })).toBeVisible()
  })

  test('logout redirects to auth page', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Register' }).click()
    await page.getByPlaceholder('Your name').fill(`LogUser_${timestamp}`)
    await page.getByPlaceholder('you@example.com').fill(`loguser_${timestamp}@test.com`)
    await page.getByPlaceholder('Min 6 characters').fill(testPassword)
    await page.getByPlaceholder('Repeat password').fill(testPassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })
    await page.getByRole('button', { name: /logout/i }).click()
    await expect(page).toHaveURL(/auth/)
  })
})
