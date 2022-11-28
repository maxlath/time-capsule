export const columns = [
  { label: 'Title', field: 'title' },
  { label: 'Frequency', field: 'frequency' },
  { label: 'Next_Visit', field: 'nextVisit' },
  { label: 'Date_Created', field: 'dateAdded' },
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
