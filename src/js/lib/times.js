const minute = 60*1000
const hour = 60*minute
const day = 24*hour
const week = 7*day
const year = 365.25*day
const month = year/12

module.exports = {
  H: hour,
  D: day,
  W: week,
  M: month,
  Y: year,
  // Adding minutes (T) as an undocumented frequency unit for development purposes
  // thus absent of src/js/popup/options
  // but present in src/js/lib/bookmark_title pattern regexp
  T: minute
}
