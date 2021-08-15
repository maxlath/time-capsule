export default function (params) {
  const { tagName, id, className, text, attributes, style, appendTo, onClick } = params
  const el = document.createElement(tagName)
  if (id) el.id = id
  if (className) el.setAttribute('class', className)
  if (text) el.textContent = text
  if (onClick) el.addEventListener('click', onClick)
  if (attributes) {
    for (const k in attributes) {
      const v = attributes[k]
      el.setAttribute(k, v)
    }
  }
  if (style) {
    for (const k in style) {
      const v = style[k]
      el.style[k] = v
    }
  }
  if (appendTo) appendTo.appendChild(el)
  if (onClick) el.addEventListener('click', onClick)
  return el
}
