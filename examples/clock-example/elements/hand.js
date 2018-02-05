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

const halfHand = svg`
  <defs>
    <linearGradient id="halfhand" x1=0 x2=0 y1=0 y2=1>
      <stop offset="0%" />
      <stop offset="50%" />
      <stop offset="50%" stop-opacity="0" />
      <stop offset="100%" stop-opacity="0" />
    </linearGradient>
  </defs>
`

module.exports = (attrs) => svg`
  <g>
    ${halfHand}
    <rect
      fill="url(#halfhand)"
      x=${50 - (attrs.width/2)} y=${50 - (attrs.radius)}
      width=${attrs.width} height=${attrs.radius*2}
      style=${handStyle(degreesFromAttrs(attrs))}
    />
  </g>
`
