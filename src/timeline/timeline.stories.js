import timeline from './timeline.js'

export default {
  title: 'Timeline',
  render: (entries) => {
    return timeline(entries)
  },
  argTypes: {
    entries: { control: 'array' },
  },
  args: {
    enries: [],
  },
}

export const Timeline = {
  args: {
    entries: [],
  },
}
