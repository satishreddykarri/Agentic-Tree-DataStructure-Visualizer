// Theme token constants — mirrors the CSS variables in global.css
// Use these in inline styles or JS logic where CSS vars aren't accessible

export const darkTheme = {
  bg:           '#07121c',
  sidebar:      '#0b1824',
  panel:        '#0f1f2d',
  panelAlt:     '#112233',
  border:       '#1e3446',
  primary:      '#1da1f2',
  primaryHover: '#1a91da',
  text:         '#ffffff',
  textMuted:    '#8fa6b8',
  textDim:      '#4a6278',
  success:      '#22c55e',
  danger:       '#ef4444',
  warning:      '#f59e0b',
} as const

export const lightTheme = {
  bg:           '#f0f4f8',
  sidebar:      '#e2e8f0',
  panel:        '#ffffff',
  panelAlt:     '#f8fafc',
  border:       '#cbd5e1',
  primary:      '#1da1f2',
  primaryHover: '#1a91da',
  text:         '#0f172a',
  textMuted:    '#475569',
  textDim:      '#94a3b8',
  success:      '#16a34a',
  danger:       '#dc2626',
  warning:      '#d97706',
} as const

export type ThemeMode = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'treeview-ai-theme'

export function getStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' ? 'light' : 'dark'
}

export function applyTheme(mode: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', mode)
  localStorage.setItem(THEME_STORAGE_KEY, mode)
}
