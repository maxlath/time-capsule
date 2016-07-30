const utils = module.exports = {
  log: (obj, label) => {
    console.log(label, obj)
    return obj
  },
  Log: (label) => (obj) => utils.log(label, obj),
  Error: (label) => (err) => console.error(label, err),
  ErrorRethrow: (label) => {
    return (err) => {
      console.error(label, err)
      throw err
    }
  }
}
