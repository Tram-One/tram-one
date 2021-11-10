import { registerHtml, useGlobalStore, useEffect, TramOneComponent } from '../../src/tram-one';
import subTab from './sub-tab';

const html = registerHtml({
	'sub-tab': subTab,
});

const defaultTabState = {
	tabWasUpdated: false,
	tabWasDismissed: false,
	shouldDisplayTab: true,
	isTabLocked: false,
	loading: true,
};

/**
 * component to test global state and control sub-tab (which has cleanup effects)
 */
const tab: TramOneComponent = () => {
	const tabState = useGlobalStore('tab-state', defaultTabState);

	// immediately update the state (verifies effects on mount)
	useEffect(() => {
		tabState.loading = false;
	});

	const tabBody = (() => {
		if (tabState.shouldDisplayTab) return html`<sub-tab />`;
		if (tabState.tabWasDismissed) return html`<p>Tab Dismissed</p>`;
		return html`<p>No Tab Information</p>`;
	})();

	return html` <section class="tab" role="tab-section">${tabBody}</section> `;
};

export default tab;
