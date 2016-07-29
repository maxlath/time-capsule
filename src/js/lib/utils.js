module.exports = {
  Error: function (label) {
    return function (err) {
      console.log(label, err)
    }
  }
}
