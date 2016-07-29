module.exports = {
  Log: function (label) {
    return function (obj) {
      console.log(label, obj)
      return obj
    }
  },
  Error: function (label) {
    return function (err) {
      console.error(label, err)
    }
  },
  ErrorRethrow: function (label) {
    return function (err) {
      console.error(label, err)
      throw err
    }
  }
}
