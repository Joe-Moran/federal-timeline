import { buildTagButton } from './tag-button'

export default {
  title: 'Timeline Tag Button',
  render: ({ text, selected, onClick }) => {
    return buildTagButton({ text, selected, onClick })
  },
  argTypes: {
    text: { control: 'text' },
    selected: { control: 'text' },
    onClick: { action: 'clicked' },
  },
}

export const TimelineTagButton = {
  args: {
    text: 'Tag',
    selected: '',
  },
}

export const Selected = {
  args: {
    text: 'Tag',
    selected: 'Tag',
  },
}
