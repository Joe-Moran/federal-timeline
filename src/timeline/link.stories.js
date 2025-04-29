import { createLink } from './link'

export default {
  title: 'Timeline Link',
  render: ({ href, text, target }) => {
    return createLink({ href, text, target })
  },
  argTypes: {
    href: { control: 'text' },
    text: { control: 'text' },
    target: { control: 'text' },
  },
}

export const TimelineLink = {
  args: {
    href: '#',
    text: 'Link',
    target: '_blank',
  },
}
