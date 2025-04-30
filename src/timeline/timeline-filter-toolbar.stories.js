import { buildFilterToolbar } from './timeline-filter-toolbar'

export default {
  title: 'Timeline Filter Toolbar',
  render: ({ subjectOptions, tagOptions, onFilterChange }) => {
    const { filterToolbar } = buildFilterToolbar({ subjectOptions, tagOptions, onFilterChange })
    return filterToolbar
  },
  argTypes: {
    subjectOptions: {
      control: {
        type: 'array',
      },
    },
    tagOptions: {
      control: {
        type: 'array',
      },
    },
    onFilterChange: { action: 'filter changed' },
  },
}

export const TimelineFilterToolbar = {
  args: {
    subjectOptions: ['Subject 1', 'Subject 2', 'Subject 3'],
    tagOptions: ['Tag 1', 'Tag 2', 'Tag 3'],
    onFilterChange: () => {},
  },
}
