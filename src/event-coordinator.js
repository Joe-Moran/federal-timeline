const eventCoordinator = {
  subscribers: {},
  on: function (event, callback) {
    this.subscribers[event] = [...(this.subscribers[event] || []), callback]
  },
  detach: function (event, callback) {
    if (!this.subscribers[event]) return
    this.subscribers[event] = this.subscribers[event].filter(
      (existingCallback) => existingCallback !== callback
    )
  },
  emit(event, data) {
    if (!this.subscribers[event]) return
    this.subscribers[event].forEach((callback) => callback(data))
  },
}

const events = {
  LOAD_URL_FILTER: 'load:urlFilter',
  FILTER_CHANGED: 'filter-changed',
}

export { eventCoordinator, events }
