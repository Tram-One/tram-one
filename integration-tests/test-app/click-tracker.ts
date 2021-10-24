import { registerHtml, useStore } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test local state management
 */
export default () => {
	const totalClicks = useStore({ clicks: 0 });
	const incrementClicks = () => totalClicks.clicks++;
	return html`
		<button class="click-tracker" role="click-tracking-button" onclick=${incrementClicks}>
			Total Clicks: ${totalClicks.clicks}
		</button>
	`;
};
