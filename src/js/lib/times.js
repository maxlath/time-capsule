const hour = 60*60*1000
const day = 24*hour
const week = 7*day
const year = 365.25*day
const month = year/12

module.exports = {
  H: hour,
  D: day,
  W: week,
  M: month,
  Y: year
}
