const { registerSvg } = require('../../src/tram-one')

const svg = registerSvg()

/**
 * component to test svg functionality
 */
module.exports = () => {
	return svg`
    <svg class="logo" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" style="max-width: 10em">
      <circle cx="5" cy="5" r="4" role="logo">
        <title>Test SVG</title>
      </circle>
    </svg>
  `
}
