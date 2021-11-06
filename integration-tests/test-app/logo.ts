import { registerSvg } from '../../src/tram-one';

const svg = registerSvg();

/**
 * component to test svg functionality
 */
export default () => {
	return svg`
    <svg class="logo" viewBox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" style="max-width: 10em">
      <circle cx="5" cy="5" r="4" role="logo" fill="#cbcbcb">
        <title>Test SVG</title>
      </circle>
      <circle cx="5" cy="5" r="3.5" role="logo" fill="#0a0f21">
      </circle>
    </svg>
  `;
};
