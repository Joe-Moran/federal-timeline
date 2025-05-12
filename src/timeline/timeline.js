import { DataSet } from 'vis-data'
import { Timeline } from 'vis-timeline/standalone'
import { buildCardTemplate } from './timeline-item-card'
import { buildClusterTemplate } from './timeline-item-cluster'
import { buildFilterToolbar } from './timeline-filter-toolbar'
import { addMonths } from 'date-fns'
import { eventCoordinator, events } from '../event-coordinator'

const timeline = (entries) => {
  const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
  const YEAR_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 365

  let timelineEntries = new DataSet(entries)
  let filter = { tag: '', subject: '' }

  let container = document.getElementById('app')

  const tagsUnique = new Set(
    timelineEntries
      .get()
      .flatMap((item) => item.content.tags)
      .sort((a, b) => a.localeCompare(b))
  )

  const subjectsUnique = new Set(
    timelineEntries
      .get()
      .flatMap((item) => item.content.properties.subject)
      .sort((a, b) => a.localeCompare(b))
  )

  const { filterToolbar } = buildFilterToolbar({
    subjectOptions: Array.from(subjectsUnique),
    tagOptions: Array.from(tagsUnique),
  })

  document.getElementsByTagName('main')[0].prepend(filterToolbar)

  let options = {
    min: '2016-01-01',
    start: '2025-01-01',
    max: addMonths(Date.now(), 8),
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
    zoomMin: DAY_IN_MILLISECONDS * 5, // 5 days
    zoomMax: YEAR_IN_MILLISECONDS * 5, // 5 years
    moveable: true,
    height: '100%',
    onInitialDrawComplete: () => {
      timeline.fit()
    },
    template: function (item, element) {
      element = item.isCluster
        ? buildClusterTemplate({ items: item.items, date: item.start })
        : buildCardTemplate({
            title: item.content.title,
            date: item.start,
            sourceHref: item.content.properties.link,
            details: item.content.text,
            tags: item.content.tags,
            filter: filter,
          }).cardTemplate

      return element
    },
    margin: {
      item: 30,
      axis: 50,
    },
  }

  let timeline = new Timeline(container, timelineEntries, options)

  const filterAction = (options) => {
    let filteredItems = timelineEntries.get({
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

  eventCoordinator.on(events.FILTER_CHANGED, filterAction)
}

export default timeline
