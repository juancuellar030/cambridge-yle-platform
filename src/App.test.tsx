import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should validate platform name', () => {
    const platformName = 'Cambridge YLE Testing Platform'
    expect(platformName).toContain('Cambridge')
    expect(platformName).toContain('YLE')
  })
})