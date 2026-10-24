import { it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { render } from '../test-utils.js'
import { createLink } from './link'

it('Keeps href when link uses https protocol', () => {
  render(createLink({ text: 'Source', href: 'https://example.com' }))

  expect(screen.getByText('Source')).toHaveAttribute('href', 'https://example.com')
})

it('Omits href when link uses javascript protocol', () => {
  render(createLink({ text: 'Source', href: 'javascript:alert(1)' }))

  expect(screen.getByText('Source')).not.toHaveAttribute('href')
})

it('Adds noopener rel when link opens in a new tab', () => {
  render(createLink({ text: 'Source', href: 'https://example.com' }))

  expect(screen.getByText('Source')).toHaveAttribute('rel', 'noopener noreferrer')
})
