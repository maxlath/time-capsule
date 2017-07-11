const _ = require('../lib/utils')
const { D: oneDay } = require('../lib/times')

var dayEnd

module.exports = {
  get: () => dayEnd,
  set: () => { dayEnd = _.now() + oneDay }
}
