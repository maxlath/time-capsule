const _ = require('../lib/utils')
const tabs = require('../lib/tabs')
const buildPopup = require('./build_popup')
const listenForKeyboardEvents = require('./listen_for_keyboard_events')

const autofocus = () => document.querySelector('.selected').focus()

tabs.getCurrentUrlBookmarkData()
.then(buildPopup)
.then(listenForKeyboardEvents)
// Popup doesn't autofocus
// https://bugzilla.mozilla.org/show_bug.cgi?id=1338909
.then(() => setTimeout(autofocus, 500))
.catch(_.Error('popup'))
