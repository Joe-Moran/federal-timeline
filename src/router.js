import { eventCoordinator, events } from './event-coordinator'

const router = () => {
  const filter = getFilterFromUrl()
  eventCoordinator.on(events.FILTER_CHANGED, (newFilter) => {
    if (newFilter != getFilterFromUrl()) {
      updateUrl(newFilter)
    }
  })

  eventCoordinator.emit(events.LOAD_URL_FILTER, filter)
}

function getFilterFromUrl() {
  const searchParams = new URLSearchParams(window.location.search)

  const tag = searchParams.get('tag') || ''
  const subject = searchParams.get('subject') || ''

  return {
    tag: tag,
    subject: subject,
  }
}

function updateUrl(filter) {
  const url = new URL(window.location)
  if (filter.tag) {
    url.searchParams.set('tag', filter.tag)
  } else {
    url.searchParams.delete('tag')
  }
  if (filter.subject) {
    url.searchParams.set('subject', filter.subject)
  } else {
    url.searchParams.delete('subject')
  }
  window.history.pushState({}, '', url)
}

export { router }
