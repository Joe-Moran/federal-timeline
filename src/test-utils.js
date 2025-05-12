import { eventCoordinator, events } from './event-coordinator.js'

export function render(component) {
  document.body.innerHTML = ''
  document.body.appendChild(component)
  const { emittedEvents: emitted } = trackEmitted()
  return { emitted }
}

function trackEmitted() {
  let emittedEvents = {}

  Object.values(events).forEach((event) => trackEvent({ event }))
  function trackEvent({ event }) {
    {
      eventCoordinator.on(
        event,
        (data) =>
          (emittedEvents[event] = emittedEvents[event] ? [...emittedEvents[event], data] : [data])
      )
    }
  }

  return { emittedEvents }
}
