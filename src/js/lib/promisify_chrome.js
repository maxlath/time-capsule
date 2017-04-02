module.exports = function (fn, context) {
  if (typeof fn !== 'function') {
    const err = new Error('expected a function')
    err.context = [ fn, context ]
    throw err
  }
  const promisified = function () {
    const args = [].slice.call(arguments)
    return new Promise(function (resolve, reject) {
      const callback = function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(result)
        }
      }

      args.push(callback)

      fn.apply(context, args)
    })
  }
  return promisified
}
