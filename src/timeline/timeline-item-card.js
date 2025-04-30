import { format } from 'date-fns'
import { createLink } from './link'
import { buildTagButton } from './tag-button'
import './timeline-item-card.css'

export const buildCardTemplate = ({
  title = '',
  date = '',
  sourceHref = '',
  details = '',
  tags = [],
  filter = { tag: '', subject: '' },
  onFilterChange = () => {},
}) => {
  const hasTags = !!tags.length
  let cardTemplate = document.createElement('div')
  let classes = ['timeline-item']
  let filterProxy = new Proxy(filter, {
    set(object, property, newValue) {
      object[property] = newValue
      onFilterChange(object)
      return true
    },
  })

  if (!hasTags) {
    classes.push('no-tags')
  }

  const elements = [
    buildDate({
      startDate: date,
    }),

    buildCardTitle({
      text: title,
      href: sourceHref,
    }),
    buildDetailsDrawer({ text: details }),
    buildTags({
      tags: tags,
      selected: filterProxy.tag,
      onClick: (e) => {
        filterProxy.tag = e.target.innerText
      },
    }),
  ]
  elements.forEach((element) => cardTemplate.appendChild(element))
  cardTemplate.classList = classes.join(' ')

  return cardTemplate
}

const buildCardTitle = ({ text = '', href = '' }) => {
  const hasLink = !!href.length

  const title = hasLink ? createLink({ text: text, href: href }) : document.createTextNode(text)

  const heading = document.createElement('h3')
  heading.className = 'timeline-item-title'
  heading.appendChild(title)

  return heading
}

const buildDetailsDrawer = ({ text }) => {
  const hasText = !!text.length
  let paragraph = document.createElement('p')
  paragraph.className = 'item-text'
  paragraph.textContent = text

  let summary = document.createElement('summary')
  summary.className = 'details-drawer'
  summary.appendChild(document.createTextNode('Details'))

  let details = document.createElement('details')
  details.appendChild(summary)
  details.appendChild(paragraph)

  return hasText ? details : document.createElement('div') // return empty div if no text
}

const buildTags = ({ tags = [], selected = '', onClick = () => {} }) => {
  const isEmpty = tags.length === 0
  const hasFiltered = !!tags.find((tag) => tag === selected)

  const truncatedTags = new Set(tags.slice(0, 3))
  if (hasFiltered) {
    truncatedTags.add(selected)
  }

  let tagBar = document.createElement('div')
  let classList = ['timeline-tags-container']
  if (isEmpty) {
    classList.push('empty')
  }

  tagBar.classList = classList.join(' ')

  const tagButtons = Array.from(truncatedTags).map((tag) =>
    buildTagButton({
      text: tag,
      selected,
      onClick,
    })
  )

  tagButtons.forEach((button) => tagBar.appendChild(button))
  return tagBar
}

const buildDate = ({ startDate }) => {
  let date = document.createElement('time')
  date.className = 'date'
  date.setAttribute('datetime', format(startDate, 'yyyy-MM-dd'))
  date.textContent = format(startDate, 'MMM d, yyyy')
  return date
}
