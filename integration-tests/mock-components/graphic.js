const { registerSvg } = require('../../src/tram-one')
const svg = registerSvg()

module.exports = () => svg`
	<svg viewBox="0 0 864 864">
		<circle data-testid="graphic-circle" fill="#FDF491" cx="100" cy="100" r="20"/>
	</svg>
`
