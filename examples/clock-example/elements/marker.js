const Tram = require('../../../tram-one')

const svg = Tram.svg()

const degreesFromAttrs = (attrs) => {
  return 360 * (attrs['value'] / attrs['max-value'])
}

const markerStyle = (degrees) => `
  transform-origin: center;
  transform: rotate(${degrees}deg);
`

const markerEdges = svg`
  <defs>
    <linearGradient id="markerEdges" x1=0 x2=0 y1=0 y2=1>
      <stop offset="0%" />
      <stop offset="5%" />
      <stop offset="5%" stop-opacity="0" />
      <stop offset="95%" stop-opacity="0" />
      <stop offset="95%" />
      <stop offset="100%" />
    </linearGradient>
  </defs>
`

module.exports = (attrs) => svg`
  <g>
    ${markerEdges}
    <rect x=${50 - attrs.width} y=10 width=${attrs.width} height=80
          style=${markerStyle(degreesFromAttrs(attrs))}
          fill="url(#markerEdges)"
    />
  </g>
`
