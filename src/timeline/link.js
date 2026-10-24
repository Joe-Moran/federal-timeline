import externalLink from '../external-link.svg'
import './link.css'

const SAFE_PROTOCOLS = ['http:', 'https:', 'mailto:']

export const createLink = ({ text = '', href = '', target = '_blank' }) => {
  const openInNewTab = target === '_blank'
  const link = document.createElement('a')
  link.setAttribute('target', target)
  if (isSafeHref(href)) {
    link.setAttribute('href', href)
  }
  if (openInNewTab) {
    link.setAttribute('rel', 'noopener noreferrer')
  }

  link.appendChild(document.createTextNode(text))
  if (openInNewTab) {
    link.appendChild(buildExternalLinkIcon())
  }
  return link
}

const isSafeHref = (href) => {
  try {
    return SAFE_PROTOCOLS.includes(new URL(href, window.location.href).protocol)
  } catch {
    return false
  }
}

const buildExternalLinkIcon = () => {
  const externalLinkIcon = document.createElement('img')
  externalLinkIcon.setAttribute('src', externalLink)
  externalLinkIcon.setAttribute('alt', '')
  externalLinkIcon.className = 'external-link'
  externalLinkIcon.setAttribute('width', '13')
  return externalLinkIcon
}
