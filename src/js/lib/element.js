module.exports = function (params) {
  var el = document.createElement(params.el)
  var { className, text, onClick, attributes, appendTo } = params
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
  } else {
    return el
  }
}