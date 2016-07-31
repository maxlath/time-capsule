const _ = require('./utils')
const oneDay = require('./times').D
const dayEnd = require('./day_end')

module.exports = (bookmark) => bookmark.nextVisit < dayEnd.get()
