import { it, expect } from 'vitest'
import { screen } from '@testing-library/dom'
import { render } from '../test-utils.js'
import { buildTagButton } from './tag-button'

it('Renders markup in tag text as plain text', () => {
  render(buildTagButton({ text: '<img src=x onerror=alert(1)>' }))

  expect(screen.getByRole('button')).toHaveTextContent('<img src=x onerror=alert(1)>')
})
