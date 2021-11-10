import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test local state management
 */
const clickTracker: TramOneComponent = () => {
	const totalClicks = useStore({ clicks: 0 });
	const incrementClicks = () => totalClicks.clicks++;
	return html`
		<button class="click-tracker" role="click-tracking-button" onclick=${incrementClicks}>
			Total Clicks: ${totalClicks.clicks}
		</button>
	`;
};

export default clickTracker;
