const Tram = require('../../../tram-one')

const svg = Tram.svg({
  hand: require('./hand'),
  marker: require('./marker')
})

const clockStyle = `
  fill: none;
  stroke: black;
`

const hourMarkers = Array(12).fill().map((_, hour) =>
  svg`<marker width="2" value=${hour} max-value="12"/>`
)

const minuteMarkers = Array(60).fill().map((_, minute) =>
  svg`<marker width="1" value=${minute} max-value="60"/>`
)

module.exports = (attrs) => svg`
  <svg viewBox="0 0 100 100" width="400" height="400">
    <circle style=${clockStyle} cx="50" cy="50" r="40" />

    <hand value=${attrs.ticker.getHours() + (attrs.ticker.getMinutes()/60)} max-value="12"
          width="2" radius="20" />
    <hand value=${attrs.ticker.getMinutes()} max-value="60"
          width="1" radius="35" />
    <hand value=${attrs.ticker.getSeconds()} max-value="60"
          width="1" radius="37" />

    ${hourMarkers}
    ${minuteMarkers}

  </svg>
`
