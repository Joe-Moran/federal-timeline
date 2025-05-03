async function fetchData() {
  const orgFile = (await import(`../current-events.org?raw`)).default
  return orgFile
}

export { fetchData }
