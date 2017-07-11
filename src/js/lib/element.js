module.exports = function (params) {
  let { tagName, id, className, text, attributes, style, appendTo, onClick } = params
  let el = document.createElement(tagName)
  if (id) el.id = id
  if (className) el.setAttribute('class', className)
  if (text) el.textContent = text
  if (onClick) el.addEventListener('click', onClick)
  if (attributes) {
    for (let k in attributes) {
      let v = attributes[k]
      el.setAttribute(k, v)
    }
  }
  if (style) {
    for (let k in style) {
      let v = style[k]
      el.style[k] = v
    }
  }
  if (appendTo) appendTo.appendChild(el)
  if (onClick) el.addEventListener('click', onClick)
  return el
}
