const dayEnd = require('./day_end')

module.exports = (bookmark) => bookmark && bookmark.nextVisit < dayEnd.get()
