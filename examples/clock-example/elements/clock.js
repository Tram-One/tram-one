const Tram = require('../../../tram-one')

const svg = Tram.svg({hand: require('./hand')})

const clockStyle = `
  fill: none;
  stroke: black;
`

module.exports = (attrs) => svg`
  <svg viewBox="0 0 100 100" width="400" height="400">
    <circle style=${clockStyle} cx="50" cy="50" r="40" />
    <hand value=${attrs.ticker.getHours()} max-value="12"
          color="black" width="2" radius="20" />
    <hand value=${attrs.ticker.getMinutes()} max-value="60"
          color="black" width="1" radius="35" />
    <hand value=${attrs.ticker.getSeconds()} max-value="60"
          color="red" width="1" radius="37" />
  </svg>
`
