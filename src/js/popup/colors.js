// Setting different background colors to show how
// different amounts of time units overlap
// With maximum color for 1 year and above
const maxDays = 365.25
const realMaxColor = 256

// Not going from 0 (00) and ending at 255 (ff)
const minColor = 24
const maxColor = 187
const colorSpread = maxColor - minColor

const getColorCoef = (num, daysFactor) => {
  let days = num * daysFactor
  if (days > maxDays) days = maxDays
  const fractionOfMaxDays = days / maxDays
  const adjustedColor = fractionOfMaxDays * colorSpread + minColor
  // Inverting so that the smallest amounts of time are the lightest
  // and the longest the darkest
  return Math.abs(adjustedColor - realMaxColor)
}

export const getColor = (num, daysFactor) => {
  const coef = getColorCoef(num, daysFactor)
  let hexaString = coef.toString(16).split('.')[0]
  // left padding with 0s
  if (hexaString.length === 1) hexaString = `0${hexaString}`
  return `#${hexaString}${hexaString}${hexaString}`
}
