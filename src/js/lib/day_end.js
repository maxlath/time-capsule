const _ = require('../lib/utils')
const oneDay = require('../lib/times').D

var dayEnd

module.exports = {
  get: () => dayEnd,
  set: () => { dayEnd = _.now() + oneDay }
}
