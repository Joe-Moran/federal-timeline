import { format } from 'date-fns'

import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'

import externalLink from '../external-link.svg'

const timeline = (entries) => {
  const resetOtherProperties = (object, property) => {
    Object.entries(object).forEach(([key]) => {
      if (key !== property) {
        object[key] = ''
      }
    })
  }
  let items = new DataSet(entries)
  let filter = new Proxy(
    { tag: '', subject: '' },
    {
      set(object, property, newValue) {
        object[property] = newValue
        resetOtherProperties(object, property)
        filterItem(object)
        return true
      },
    }
  )
  let container = document.getElementById('app')

  const tagsUnique = new Set(
    items
      .get()
      .flatMap((item) => item.content.tags)
      .sort((a, b) => a.localeCompare(b))
  )

  const subjectsUnique = new Set(
    items
      .get()
      .flatMap((item) => item.content.properties.subject)
      .sort((a, b) => a.localeCompare(b))
  )

  function createFilter({ values = [] }) {
    return values.map((value) => {
      let filterOption = document.createElement('option')
      filterOption.value = value
      filterOption.innerText = value
      return filterOption
    })
  }

  function createSubjectFilter() {
    let filterInput = document.getElementById('filter-subject')
    let filterOptions = createFilter({ values: Array.from(subjectsUnique) })
    filterOptions.forEach((option) => {
      filterInput.appendChild(option)
    })
    filterInput.addEventListener('change', (e) => {
      filter.subject = e.target.value
    })
    return filterInput
  }

  function createTagFilter() {
    let filterInput = document.getElementById('filter-tag')
    let filterOptions = createFilter({ values: Array.from(tagsUnique) })
    filterOptions.forEach((option) => {
      filterInput.appendChild(option)
    })
    filterInput.addEventListener('change', (e) => {
      filter.tag = e.target.value
    })
    return filterInput
  }

  createSubjectFilter()
  createTagFilter()

  function createLink({ text = '', href = '', target = '_blank' }) {
    const openInNewTab = target === '_blank'
    const link = document.createElement('a')
    link.setAttribute('target', target)
    link.setAttribute('href', href)

    if (openInNewTab) {
      const externalLinkIcon = document.createElement('img')
      externalLinkIcon.setAttribute('src', externalLink)
      externalLinkIcon.setAttribute('alt', '')
      externalLinkIcon.className = 'external-link'
      link.appendChild(externalLinkIcon)
    }
    link.appendChild(document.createTextNode(text))
    return link
  }

  const buildCardTitle = ({ text = '', href = '' }) => {
    const hasLink = !!href.length

    const title = hasLink ? createLink({ text: text, href: href }) : document.createTextNode(text)

    const heading = document.createElement('h3')
    heading.className = 'timeline-item-title'
    heading.appendChild(title)

    return heading
  }

  const buildListItem = ({ text, href }) => {
    const clusterItem = document.createElement('li')
    clusterItem.className = 'timeline-cluster-item'
    clusterItem.appendChild(createLink({ text, href }))
    return clusterItem
  }

  const buildDetailsDrawer = ({ text }) => {
    const hasText = !!text.length
    let paragraph = document.createElement('p')
    paragraph.className = 'item-text'
    paragraph.textContent = text

    let summary = document.createElement('summary')
    summary.className = 'details-drawer'
    summary.textContent = 'Details'

    let details = document.createElement('details')
    details.appendChild(summary)
    details.appendChild(paragraph)

    return hasText ? details : document.createElement('div') // return empty div if no text
  }

  const buildTagButton = ({ text = '', onClick = () => {} }) => {
    const isSelected = text === filter.tag
    let button = document.createElement('button')

    let classList = ['timeline-tag']
    if (isSelected) {
      classList.push('selected')
    }
    button.setAttribute('type', 'button')
    button.setAttribute('aria-pressed', isSelected)
    button.classList = classList
    button.innerText = text
    button.addEventListener('click', (event) => {
      onClick(event)
    })
    return button
  }

  const buildTags = ({ tags = [], selected = '' }) => {
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

    tagBar.classList = classList

    const tagButtons = Array.from(truncatedTags).map((tag) =>
      buildTagButton({
        text: tag,
        onClick: (e) => {
          //   filterItem({ tag: e.target.innerText });
          filter.tag = e.target.innerText
        },
      })
    )

    tagButtons.forEach((button) => tagBar.appendChild(button))
    return tagBar
  }

  const buildDate = ({ startDate }) => {
    let date = document.createElement('span')
    date.className = 'date'
    date.textContent = format(startDate, 'MMM d, yyyy')
    return date
  }

  const buildCardTemplate = (item) => {
    const hasTags = !!item.content.tags.length
    let cardTemplate = document.createElement('div')
    let classes = ['timeline-item']

    if (!hasTags) {
      classes.push('no-tags')
    }

    const elements = [
      buildDate({
        startDate: item.start,
      }),

      buildCardTitle({
        text: item.content.title,
        href: item.content.properties.link,
      }),
      buildDetailsDrawer({ text: item.content.text }),
      buildTags({
        tags: item.content.tags,
        selected: filter.tag,
      }),
    ]
    elements.forEach((element) => cardTemplate.appendChild(element))
    cardTemplate.classList = classes

    return cardTemplate
  }

  const selectTagOption = (tag) => {
    let selectElement = document.getElementById('filter-tag')
    selectElement.value = tag
  }

  const selectSubjectOption = (subject) => {
    let selectElement = document.getElementById('filter-subject')
    selectElement.value = subject
  }

  const buildClusterTemplate = (item) => {
    let clusterItems = item.items.map((item) =>
      buildListItem({ text: item.content.title, href: item.content.properties.link })
    )
    let date = document.createElement('span')
    date.className = 'date'
    date.textContent = format(item.start, 'MMM d, yyyy')
    let list = document.createElement('ul')
    clusterItems.forEach((item) => list.appendChild(item))
    let cluster = document.createElement('div')
    cluster.className = 'timeline-item'
    cluster.appendChild(date)
    cluster.appendChild(list)

    let count = document.createElement('div')
    count.textContent = item.items.length

    return item.items.length > 4 ? count : cluster
  }

  let options = {
    min: '2016-01-01',
    start: '2025-01-01',
    editable: false,
    stack: true,
    zoomable: true,
    horizontalScroll: true,
    selectable: false,
    zoomKey: 'metaKey',
    orientation: 'top',
    verticalScroll: true,
    showCurrentTime: false,
    align: 'auto',
    cluster: { showStipes: true, maxItems: 2 },
    zoomMin: (1000 * 60 * 60 * 24 * 30) / 9, // 1 month
    zoomMax: 1000 * 60 * 60 * 24 * 30 * 12 * 3, // 3 year
    moveable: true,
    height: '100%',
    template: function (item, element) {
      element.replaceChildren() // clear element because timeline redraw will keep appending nodes
      if (item.isCluster) {
        return element.appendChild(buildClusterTemplate(item))
      }
      return element.appendChild(buildCardTemplate(item))
    },
    margin: {
      item: 30,
      axis: 50,
    },
  }

  let timeline = new Timeline(container, items, options)

  const filterItem = (options) => {
    // filter = options;
    selectTagOption(options.tag)
    selectSubjectOption(options.subject)
    let filteredItems = items.get({
      filter: function (item) {
        if (options.tag != '') {
          return item.content.tags.includes(options.tag)
        }

        if (options.subject != '') {
          return item.content.properties.subject === options.subject
        }
        return true
      },
    })
    timeline.setItems(filteredItems)
    timeline.fit()
  }
}

export default timeline
