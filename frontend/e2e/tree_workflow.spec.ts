import { test, expect } from '@playwright/test'

const timestamp = Date.now()
const testPassword = 'testpassword123'

async function registerAndGoToWorkspace(page: import('@playwright/test').Page, suffix: string) {
  await page.goto('/auth')
  await page.getByRole('button', { name: 'Register' }).click()
  await page.getByPlaceholder('Your name').fill(`WsUser_${suffix}`)
  await page.getByPlaceholder('you@example.com').fill(`wsuser_${suffix}@test.com`)
  await page.getByPlaceholder('Min 6 characters').fill(testPassword)
  await page.getByPlaceholder('Repeat password').fill(testPassword)
  await page.getByRole('button', { name: /create account/i }).click()
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 })
  await page.getByRole('button', { name: /new session/i }).click()
  await expect(page).toHaveURL(/workspace/, { timeout: 15000 })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
}

test.describe('Tree Workflow', () => {
  test('can create a new session from dashboard', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_1`)
    await expect(page).toHaveURL(/workspace/)
  })

  test('workspace shows empty state canvas', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_2`)
    await expect(page.getByText('Start building your tree')).toBeVisible({ timeout: 10000 })
  })

  test('workspace shows AI Assistant panel', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_3`)
    await expect(page.getByText('AI Assistant')).toBeVisible({ timeout: 10000 })
  })

  test('workspace shows Add Node button in sidebar', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_4`)
    await expect(page.getByRole('button').filter({ hasText: 'Add Node' }).first()).toBeVisible({ timeout: 15000 })
  })

  test('workspace shows traversal buttons', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_5`)
    await expect(page.getByText('Pre-order Traversal')).toBeVisible({ timeout: 10000 })
  })

  test('Add Root Node button is visible', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_6`)
    await expect(page.getByRole('button', { name: /add root node/i })).toBeVisible({ timeout: 10000 })
  })

  test('chat input is visible and enabled', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_7`)
    const chatInput = page.getByPlaceholder('Type a command...')
    await expect(chatInput).toBeVisible({ timeout: 10000 })
    await expect(chatInput).toBeEnabled()
  })

  test('can type in chat input', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_8`)
    const chatInput = page.getByPlaceholder('Type a command...')
    await expect(chatInput).toBeEnabled({ timeout: 10000 })
    await chatInput.fill('insert node 10 as root')
    await expect(chatInput).toHaveValue('insert node 10 as root')
  })

  test('send button becomes active when text typed', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_9`)
    const chatInput = page.getByPlaceholder('Type a command...')
    await expect(chatInput).toBeEnabled({ timeout: 10000 })
    await chatInput.fill('hello')
    await expect(page.getByRole('button', { name: /send/i })).toBeEnabled()
  })

  test('navbar shows Agentic Tree branding', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_10`)
    await expect(page.locator('text=Agentic Tree').first()).toBeVisible({ timeout: 10000 })
  })

  test('reset tree button is in sidebar', async ({ page }) => {
    await registerAndGoToWorkspace(page, `${timestamp}_11`)
    await expect(page.getByRole('button', { name: /reset tree/i })).toBeVisible({ timeout: 10000 })
  })
})
