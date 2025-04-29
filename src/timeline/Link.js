import externalLink from '../external-link.svg'

export const createLink = ({ text = '', href = '', target = '_blank' }) => {
  const openInNewTab = target === '_blank'
  const link = document.createElement('a')
  link.setAttribute('target', target)
  link.setAttribute('href', href)

  if (openInNewTab) {
    const externalLinkIcon = document.createElement('img')
    externalLinkIcon.setAttribute('src', externalLink)
    externalLinkIcon.setAttribute('alt', '')
    externalLinkIcon.className = 'external-link'
    link.appendChild(externalLinkIcon)
  }
  link.appendChild(document.createTextNode(text))
  return link
}
