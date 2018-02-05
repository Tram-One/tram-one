const Tram = require('../../../tram-one')

// the hands to render in the clock
const svg = Tram.svg()

const handStyle = (degrees) => `
  transform-origin: center;
  transform: rotate(${degrees}deg);
`

const degreesFromAttrs = (attrs) => {
  return 360 * (attrs['value'] / attrs['max-value'])
}

module.exports = (attrs) => svg`
  <rect
    x=${50 - (attrs.width/2)} y=${50 - (attrs.radius)}
    width=${attrs.width} height=${attrs.radius*2}
    fill=${attrs.color}
    style=${handStyle(degreesFromAttrs(attrs))}
  />
`
