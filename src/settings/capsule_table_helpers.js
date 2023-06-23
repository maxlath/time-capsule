export const columns = [
  { label: 'Title', field: 'title' },
  { label: 'Frequency', field: 'frequency' },
  { label: 'Repeat', field: 'repeat' },
  { label: 'Next_visit', field: 'nextVisit' },
  { label: 'Actions' },
]

export const filterByText = textFilter => {
  const normalizedTextFilter = normalizeString(textFilter)
  return bookmark => {
    const { title, url } = bookmark
    if (normalizeString(title).includes(normalizedTextFilter)) return true
    if (normalizeString(url).includes(normalizedTextFilter)) return true
    return false
  }
}

const normalizeString = str => str.trim().normalize().toLowerCase()
