import externalLink from '../external-link.svg'
import './link.css'

export const createLink = ({ text = '', href = '', target = '_blank' }) => {
  const openInNewTab = target === '_blank'
  const link = document.createElement('a')
  link.setAttribute('target', target)
  link.setAttribute('href', href)

  link.appendChild(document.createTextNode(text))
  if (openInNewTab) {
    link.appendChild(buildExternalLinkIcon())
  }
  return link
}

const buildExternalLinkIcon = () => {
  const externalLinkIcon = document.createElement('img')
  externalLinkIcon.setAttribute('src', externalLink)
  externalLinkIcon.setAttribute('alt', '')
  externalLinkIcon.className = 'external-link'
  externalLinkIcon.setAttribute('width', '13')
  return externalLinkIcon
}
