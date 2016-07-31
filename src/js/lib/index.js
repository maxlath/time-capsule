const storage = require('./storage')
const indexKey = 'index'

const get = storage.get.bind(null, indexKey)
const set = storage.set.bind(null, indexKey)

function keyAction (action, key) {
  return get()
  .then((index) => {
    let indexSet = new Set(index || [])
    indexSet[action](key)
    index = Array.from(indexSet)
    return set(index)
  })
}

module.exports = {
  get: get,
  add: keyAction.bind(null, 'add'),
  remove: keyAction.bind(null, 'delete')
}
