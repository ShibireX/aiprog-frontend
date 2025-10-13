import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FooterView } from './footer-view'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('<FooterView />', () => {
  it('has all three links to the footer pages', () => {
    render(<FooterView />)
    const footer = screen.getByRole('contentinfo')

    const links = within(footer).getAllByRole('link')
    expect(links).toHaveLength(3)

    const hrefs = links.map(a => (a as HTMLAnchorElement).getAttribute('href'))
    expect(hrefs).toEqual(
      expect.arrayContaining(['/thisproject', '/about', '/cookies'])
    )
  })
})
