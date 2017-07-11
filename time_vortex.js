const timeVortex = require('time-vortex')
const { EventEmitter } = require('events')
const radio = new EventEmitter()
const timeLinearisationRatio = (1 + Math.pow(5, 0.5)) / 2
const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

timeVortex({ mode: 'tunnel' })
.listen(7777)
.on('init', res => {
  const { timeAndRelativeDimensionInSpace, wibblyWobblyRatio } = res
  radio.emit('time:vortex:init', wibblyWobblyRatio / timeLinearisationRatio, timeAndRelativeDimensionInSpace)
})
.on('data', capsule => {
  capsule.timeLandingSpeedEasingFn = easeInOutQuad
  radio.emit('time:capsule', capsule)
})

module.exports = radio
