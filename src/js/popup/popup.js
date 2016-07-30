const _ = require('../lib/utils')
const tabs = require('../lib/tabs')
const buildPopup = require('./build_popup')

tabs.getCurrentUrlBookmarkData()
.then(buildPopup)
.catch(_.Error('popup'))
