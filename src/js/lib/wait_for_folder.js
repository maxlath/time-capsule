module.exports = (API) => {
  // Build a function that will wait for the folderId to be accessible before executing
  return function WaitForFolder (name) {
    // Not using an arrow functions here as it doesn't have its own `arguments` object
    // see: http://stackoverflow.com/q/30935336/3324977
    return function () {
      const args = arguments
      return API.waitForFolder
      .then(() => API[`_${name}`].apply(null, args))
    }
  }
}
