import { fn } from '@storybook/test'
import { buildCardTemplate } from './timeline-item-card.js'

export default {
  title: 'Timeline Item Card',
  render: ({ title, date, sourceHref, details, tags, filter, onFilterChange }) => {
    return buildCardTemplate({
      title,
      date,
      sourceHref,
      details,
      tags,
      filter,
      onFilterChange,
    })
  },
  argTypes: {
    title: { control: 'text' },
    date: { control: 'date' },
    sourceHref: { control: 'text' },
    details: { control: 'text' },
    tags: { control: 'array' },
    filter: { control: 'object' },
    onFilterChange: { action: 'onFilterChange' },
  },
  args: {
    onFilterChange: fn(),
  },
}

export const TimelineItemCard = {
  args: {
    title: 'Primary Timeline Item',
    date: Date.now(),
    sourceHref: 'https://example.com',
    details: 'Details about the primary timeline item.',
    tags: ['tag1', 'tag2'],
    filter: { tag: '', subject: '' },
  },
}
