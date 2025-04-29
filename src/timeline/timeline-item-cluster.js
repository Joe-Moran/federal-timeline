import { createLink } from './link'
import { format } from 'date-fns'

import './timeline-item.css'

export const buildClusterTemplate = ({ items = [], date = '', displayCountOnlyForMin = 4 }) => {
  let clusterItems = items.map((item) =>
    buildListItem({ text: item.content.title, href: item.content.properties.link })
  )
  let dateElement = document.createElement('span')
  dateElement.className = 'date'
  dateElement.textContent = format(date, 'MMM d, yyyy')
  let list = document.createElement('ul')
  clusterItems.forEach((item) => list.appendChild(item))
  let cluster = document.createElement('div')
  cluster.className = 'timeline-item'
  cluster.appendChild(dateElement)
  cluster.appendChild(list)

  let count = document.createElement('div')
  count.textContent = items.length

  return items.length > displayCountOnlyForMin ? count : cluster
}

const buildListItem = ({ text, href }) => {
  const clusterItem = document.createElement('li')
  clusterItem.className = 'timeline-cluster-item'
  clusterItem.appendChild(createLink({ text, href }))
  return clusterItem
}
