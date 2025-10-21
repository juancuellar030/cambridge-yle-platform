import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock react-router-dom for testing
const AppWithRouter = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('App', () => {
  it('renders the Cambridge YLE Platform header', () => {
    render(<AppWithRouter />)
    expect(screen.getByText('Cambridge YLE Platform')).toBeDefined()
  })

  it('renders the welcome message', () => {
    render(<AppWithRouter />)
    expect(screen.getByText('Welcome to Cambridge YLE Testing Platform')).toBeDefined()
  })
})