import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'
import { buildCardTemplate } from './timeline-item-card'
import { buildClusterTemplate } from './timeline-item-cluster'
import { buildFilterToolbar } from './timeline-filter-toolbar'

const timeline = (entries) => {
  let items = new DataSet(entries)
  let filter = { tag: '', subject: '' }

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

  const { filterToolbar, updateFilter } = buildFilterToolbar({
    subjectOptions: Array.from(subjectsUnique),
    tagOptions: Array.from(tagsUnique),
    onFilterChange: (updatedFilters) => {
      filterItem(updatedFilters)
    },
  })

  document.body.prepend(filterToolbar)

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
      element = item.isCluster
        ? buildClusterTemplate({ items: item.items, date: item.start })
        : buildCardTemplate({
            title: item.content.title,
            date: item.start,
            sourceHref: item.content.properties.link,
            details: item.content.properties.details,
            tags: item.content.tags,
            filter: filter,
            onFilterChange: (options) => {
              updateFilter(options)
            },
          })

      return element
    },
    margin: {
      item: 30,
      axis: 50,
    },
  }

  let timeline = new Timeline(container, items, options)

  const filterItem = (options) => {
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
    // filter = options
  }
}

export default timeline
