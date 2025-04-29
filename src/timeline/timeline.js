import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'
import { buildCardTemplate } from './timeline-item-card'
import { buildClusterTemplate } from './timeline-item-cluster'

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

  const selectTagOption = (tag) => {
    let selectElement = document.getElementById('filter-tag')
    selectElement.value = tag
  }

  const selectSubjectOption = (subject) => {
    let selectElement = document.getElementById('filter-subject')
    selectElement.value = subject
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
        return element.appendChild(buildClusterTemplate({ items: item.items, date: item.start }))
      }
      return element.appendChild(
        buildCardTemplate({
          title: item.content.title,
          date: item.start,
          sourceHref: item.content.properties.link,
          details: item.content.properties.details,
          tags: item.content.tags,
          filter: filter,
          onFilterChange: (options) => {
            filter = options
          },
        })
      )
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
