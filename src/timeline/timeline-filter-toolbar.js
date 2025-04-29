function resetOtherProperties(object, property) {
  Object.entries(object).forEach(([key]) => {
    if (key !== property) {
      object[key] = ''
    }
  })
}

export function buildFilterToolbar({
  subjectOptions = [],
  tagOptions = [],
  onFilterChange = () => {},
}) {
  let filterToolbar = document.createElement('div')
  filterToolbar.className = 'filters'

  filterToolbar.appendChild(
    createTagFilter({
      onChange: (event) => (filter.tag = event.target.value),
      tagOptions,
    })
  )
  filterToolbar.appendChild(
    createSubjectFilter({
      onChange: (event) => (filter.subject = event.target.value),
      subjectOptions,
    })
  )

  let filter = new Proxy(
    { tag: '', subject: '' },
    {
      set(object, property, newValue) {
        object[property] = newValue
        resetOtherProperties(object, property)
        onFilterChange(object)
        selectTagOption(object.tag)
        selectSubjectOption(object.subject)
        return true
      },
    }
  )

  function updateFilter(updatedFilter) {
    // filter
    onFilterChange(updatedFilter)
  }

  return { filterToolbar, updateFilter }
}

const selectTagOption = (tag) => {
  let selectElement = document.getElementById('filter-tag')
  selectElement.value = tag
}

const selectSubjectOption = (subject) => {
  let selectElement = document.getElementById('filter-subject')
  selectElement.value = subject
}

function createSubjectFilter({ subjectOptions = [], onChange = () => {} }) {
  let filterInput = createFilterSelect({
    id: 'filter-subject',
    label: 'Subject',
    optionsElements: createFilterOptions({ values: subjectOptions }),
    onChange,
  })

  return filterInput
}

function createTagFilter({ tagOptions = [], onChange = () => {} }) {
  let filterInput = createFilterSelect({
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

function createFilterSelect({ id = '', label = '', optionsElements = [], onChange = () => {} }) {
  let filterSelect = document.createElement('select')
  filterSelect.id = id
  filterSelect.className = 'timeline-filter-select'
  let filterLabel = document.createElement('label')
  filterLabel.appendChild(document.createTextNode(label))
  filterLabel.appendChild(filterSelect)

  optionsElements.forEach((option) => {
    filterSelect.appendChild(option)
  })

  filterSelect.addEventListener('change', onChange)

  return filterLabel
}
