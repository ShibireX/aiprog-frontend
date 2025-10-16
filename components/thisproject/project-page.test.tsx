import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectView } from './project-page'

vi.mock('@/components/ui/back-to-search', () => ({
  BackToSearch: () => <button data-testid="back-to-search">Back</button>,
}))

describe('<ProjectView />', () => {
  it('renders Papr h1 as link back to start', () => {
    render(<ProjectView />)

    const heading = screen.getByRole('heading', {
      level: 1, // h1
      name: /\[ Papr \]/i,
    })
    expect(heading).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /\[ Papr \]/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('includes the back to search button', () => {
    render(<ProjectView />)
    expect(screen.getByTestId('back-to-search')).toBeInTheDocument()
  })
})
