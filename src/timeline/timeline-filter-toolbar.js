function createFilterOptions({ values = [] }) {
  return ['', ...values].map((value) => {
    let filterOption = document.createElement('option')
    filterOption.value = value
    filterOption.innerText = value
    return filterOption
  })
}

export function buildFilterToolbar({
  subjectOptions = [],
  tagOptions = [],
  onTagChange = () => {},
  onSubjectChange = () => {},
}) {
  let filterToolbar = document.createElement('div')
  filterToolbar.className = 'filters'
  filterToolbar.appendChild(createSubjectFilter({ onChange: onSubjectChange, subjectOptions }))
  filterToolbar.appendChild(createTagFilter({ onChange: onTagChange, tagOptions }))
  return filterToolbar
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
