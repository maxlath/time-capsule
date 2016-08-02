const aliases = {
  ',': '.'
}

module.exports = (key) => aliases[key] || key
