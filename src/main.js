import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import './style.css'
import { fetchData } from './data.js'
import { initializeAnalytics } from './analytics.js'
import { toTimelineItems } from './data-formatter.js'
import { parseToJson } from './org'
import { router } from './router.js'
import { eventCoordinator, events } from './event-coordinator.js'
import timeline from './timeline/timeline.js'
;(async () => {
  initializeAnalytics()

  const data = await fetchData()
  timeline(toTimelineItems(parseToJson(data)))

  eventCoordinator.on(events.LOAD_URL_FILTER, (filter) => {
    eventCoordinator.emit(events.FILTER_CHANGED, filter)
  })

  window.onload = () => {
    router()
  }
})()
