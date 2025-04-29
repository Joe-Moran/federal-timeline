import { parse } from 'uniorg-parse/lib/parser.js'

const getSection = (child) => child.type === 'section'

const separateTitleFromContent = (children) => {
  const title = children.find((child) => child.type === 'headline')
  const content = children.filter((child) => child.type !== 'headline')
  return {
    title: title ? title.rawValue : '',
    content: content.filter(getSection).map((child) => child.children),
  }
}

const buildPropertyDrawer = (children) => {
  return {
    link: children.find((child) => child.key == 'Link')?.value ?? '',
    subject: children.find((child) => child.key == 'Subject')?.value ?? '',
    branch: children.find((child) => child.key == 'Branch')?.value ?? '',
  }
}

const parseContent = (content) => {
  return {
    properties: buildPropertyDrawer(
      content.find((child) => child.type === 'property-drawer')?.children ?? []
    ),
    backlinks:
      content.find((child) => child.type === 'drawer' && child.value == 'BACKLINKS')?.children ??
      [],
    related:
      content.find((child) => child.type === 'drawer' && child.value == 'RELATED')?.children ?? [],

    text:
      content
        .find((child) => child.type !== 'property-drawer')
        ?.children.flat()
        .map((child) => child.value)
        .join('') ?? '',
  }
}

const buildPost = (post) => {
  let parsed = separateTitleFromContent(post)

  return {
    title: parsed.title,
    tags: post.find((child) => child.type === 'headline')?.tags ?? [],
    ...parseContent(post.filter((child) => child.type !== 'headline')),
  }
}

const buildPostsForDay = (dayPosts) => {
  let parsed = separateTitleFromContent(dayPosts)
  return {
    day: parsed.title,
    posts: parsed.content.map(buildPost),
  }
}

const parseToJson = (data) => {
  const tree = parse(data)
  const years = tree.children
    .filter(getSection)
    .map((section) => separateTitleFromContent(section.children))
    .filter((year) => year.title.match(/^\d{4}$/))

  const formatted = years.flatMap((year) =>
    year.content.flatMap((monthDays) => {
      let parsed = separateTitleFromContent(monthDays)
      return parsed.content.map(buildPostsForDay)
    })
  )

  return formatted
}

export { parseToJson }
