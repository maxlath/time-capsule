const _ = require('../lib/utils')
const tabs = require('../lib/tabs')
const buildPopup = require('./build_popup')
const listenForKeyboardEvents = require('./listen_for_keyboard_events')

tabs.getCurrentUrlBookmarkData()
.then(buildPopup)
.then(listenForKeyboardEvents)
.catch(_.Error('popup'))
