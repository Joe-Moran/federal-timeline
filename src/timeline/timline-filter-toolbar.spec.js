/**
 * @jest-environment jsdom
 */

import { it, expect } from 'vitest'
import { events } from '../event-coordinator.js'
import { buildFilterToolbar } from './timeline-filter-toolbar'
import { waitFor, screen } from '@testing-library/dom'
import { render } from '../test-utils.js'
// adds special assertions like toHaveTextContent
import userEvent from '@testing-library/user-event'

const defaultProps = {
  subjectOptions: ['Subject 1', 'Subject 2'],
  tagOptions: ['Tag 1', 'Tag 2'],
}

it('Emits filter changed event when option is selected', async () => {
  const { emitted } = render(buildFilterToolbar({ ...defaultProps }).filterToolbar)
  const inputSelect = screen.getByLabelText(/tag/i)
  const expectedTag = 'Tag 1'

  userEvent.selectOptions(inputSelect, expectedTag)

  await waitFor(() => {
    expect(emitted[events.FILTER_CHANGED][0]).toStrictEqual({ tag: expectedTag, subject: '' })
  })
})
