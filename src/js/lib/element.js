module.exports = function (params) {
  var { tagName, id, className, text, onClick, attributes, appendTo } = params
  var el = document.createElement(tagName)
  if (id) {
    el.id = id
  }
  if (className) {
    el.setAttribute('class', className)
  }
  if (text) {
    el.textContent = text
  }
  if (onClick) {
    el.addEventListener('click', onClick)
  }
  if (attributes) {
    for (var k in attributes) {
      var v = attributes[k]
      el.setAttribute(k, v)
    }
  }
  if (appendTo) {
    appendTo.appendChild(el)
  }
  return el
}