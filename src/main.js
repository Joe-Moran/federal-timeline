import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import './style.css'
import { parse } from 'date-fns'
import { parseToJson } from './org'
import { initializeAnalytics } from './analytics.js'

import { split } from 'change-case'
import timeline from './timeline/timeline.js'
;(async () => {
  initializeAnalytics()
  const orgFile = (await import(`../current-events.org?raw`)).default

  const toTimelineItems = (json) =>
    json.flatMap((item, index) =>
      item.posts.map((post, postIndex) => ({
        id: `${index}-${postIndex}`,
        content: {
          ...post,
          tags: post.tags.map((tag) => split(tag).join(' ')),
        },
        start: parse(item.day, 'yyyy-MM-dd EEEE', new Date()),
        type: 'box',
        style: 'max-width: 300px; white-space: normal; overflow: hidden; text-overflow: ellipsis;',
      }))
    )

  let entriesFormatted = toTimelineItems(parseToJson(orgFile))

  timeline(entriesFormatted)
})()
