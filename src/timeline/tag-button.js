import './tag-button.css'

export const buildTagButton = ({ text = '', selected = '', onClick = () => {} }) => {
  const isSelected = text === selected
  let button = document.createElement('button')

  let classList = ['timeline-tag']
  if (isSelected) {
    classList.push('selected')
  }
  button.setAttribute('type', 'button')
  button.setAttribute('aria-pressed', isSelected)
  button.classList = classList.join(' ')
  button.innerHTML = text
  button.addEventListener('click', onClick)
  return button
}
