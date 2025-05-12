import './timeline-filter-toolbar.css'
import { eventCoordinator, events } from '../event-coordinator.js'

export function buildFilterToolbar({ subjectOptions = [], tagOptions = [] }) {
  let filterToolbar = document.createElement('div')
  filterToolbar.className = 'filters'

  const tagFilter = createTagFilter({
    onChange: (event) => (filter.tag = event.target.value),
    tagOptions,
  })

  const subjectFilter = createSubjectFilter({
    onChange: (event) => (filter.subject = event.target.value),
    subjectOptions,
  })

  filterToolbar.appendChild(tagFilter)
  filterToolbar.appendChild(subjectFilter)

  let filter = new Proxy(
    { tag: '', subject: '' },
    {
      set(object, property, newValue) {
        object[property] = newValue
        eventCoordinator.emit(events.FILTER_CHANGED, object)

        selectTagOption(object.tag)
        selectSubjectOption(object.subject)

        return true
      },
    }
  )

  eventCoordinator.on(events.FILTER_CHANGED, (newFilter) => {
    updateFilter(newFilter)
  })

  function updateFilter(updatedFilter) {
    selectTagOption(updatedFilter.tag)
    selectSubjectOption(updatedFilter.subject)
  }

  return { filterToolbar }
}

const selectTagOption = (tag) => {
  let selectElement = document.getElementById('filter-tag')
  selectElement.value = tag
  const selectedTag = selectElement.querySelector(`option[value="${tag}"]`)
  selectedTag.selected = tag
}

const selectSubjectOption = (subject) => {
  let selectElement = document.getElementById('filter-subject')
  selectElement.value = subject
}

function createSubjectFilter({ subjectOptions = [], onChange = () => {} }) {
  let filterInput = createSelectInput({
    id: 'filter-subject',
    label: 'Subject',
    optionsElements: createFilterOptions({ values: subjectOptions }),
    onChange,
  })

  return filterInput
}

function createTagFilter({ tagOptions = [], onChange = () => {} }) {
  let filterInput = createSelectInput({
    id: 'filter-tag',
    label: 'Tag',
    optionsElements: createFilterOptions({ values: tagOptions }),
    onChange,
  })

  return filterInput
}

function createFilterOptions({ values = [] }) {
  return ['', ...values].map((value) => {
    let filterOption = document.createElement('option')
    filterOption.value = value
    filterOption.innerText = value
    return filterOption
  })
}

function createSelectInput({ id = '', label = '', optionsElements = [], onChange = () => {} }) {
  let filterSelect = document.createElement('select')
  filterSelect.id = id
  filterSelect.className = 'timeline-filter-select'
  let filterLabel = document.createElement('label')
  filterLabel.appendChild(document.createTextNode(label))
  filterLabel.appendChild(filterSelect)

  optionsElements.forEach((option) => {
    filterSelect.appendChild(option)
  })

  filterSelect.addEventListener('input', onChange)

  return filterLabel
}
