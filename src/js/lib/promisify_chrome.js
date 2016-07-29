module.exports = function (fn, context) {
  const promisified = function () {
    const args = [].slice.call(arguments)
    return new Promise(function (resolve, reject) {

      const callback = function (result) {
        if (chrome.extension.lastError) {
          reject(chrome.extension.lastError)
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