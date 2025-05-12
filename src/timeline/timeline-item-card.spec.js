import { it, expect } from 'vitest'
import { events } from '../event-coordinator.js'
import { buildCardTemplate } from './timeline-item-card'
import { waitFor, screen } from '@testing-library/dom'
import { render } from '../test-utils.js'
import userEvent from '@testing-library/user-event'

const defaultProps = {
  title: 'Title',
  date: Date.now(),
  sourceHref: 'https://example.com',
  details: 'Details',
  tags: ['Tag 1', 'Tag 2'],
  filter: { tag: '', subject: '' },
}

it('Emits filter changed event when non-active tag is clicked', async () => {
  const { emitted } = render(buildCardTemplate({ ...defaultProps }).cardTemplate)
  const tagButton = screen.getByRole('button', { name: /tag 1/i })
  const expectedTag = 'Tag 1'

  userEvent.click(tagButton)

  await waitFor(() => {
    expect(emitted[events.FILTER_CHANGED][0]).toStrictEqual({ tag: expectedTag, subject: '' })
  })
})

it('Renders tag toggle button as "on" when props.tags contains the tag', () => {
  render(buildCardTemplate({ ...defaultProps, filter: { tag: 'Tag 1', subject: '' } }).cardTemplate)
  const tagButton = screen.getByRole('button', { name: /tag 1/i })

  expect(tagButton).toHaveAttribute('aria-pressed', 'true')
})

it('Renders tag toggle button as "off" when props.tags does not contain the tag', () => {
  render(buildCardTemplate({ ...defaultProps, filter: { tag: 'Tag 3', subject: '' } }).cardTemplate)
  const tagButtons = screen.getAllByRole('button', { name: /tag/i })

  expect(tagButtons.every((button) => button.getAttribute('aria-pressed') == 'false')).toBeTruthy()
})
