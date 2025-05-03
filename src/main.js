import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import './style.css'
import { fetchData } from './data.js'
import { initializeAnalytics } from './analytics.js'
import { split } from 'change-case'
import { parse } from 'date-fns'
import { parseToJson } from './org'

import timeline from './timeline/timeline.js'
;(async () => {
  initializeAnalytics()
  const data = await fetchData()
  timeline(toTimelineItems(parseToJson(data)))
})()

const toTimelineItems = (json) => {
  const STYLE = 'max-width: 300px; white-space: normal; overflow: hidden; text-overflow: ellipsis;'
  const DATE_FORMAT = 'yyyy-MM-dd EEEE'

  return json.flatMap((item, index) =>
    item.posts.map((post, postIndex) => ({
      id: `${index}-${postIndex}`,
      content: {
        ...post,
        tags: post.tags.map((tag) => split(tag).join(' ')),
      },
      start: parse(item.day, DATE_FORMAT, new Date()),
      type: 'box',
      style: STYLE,
    }))
  )
}
