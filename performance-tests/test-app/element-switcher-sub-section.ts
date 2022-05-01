const { registerHtml, useGlobalStore, useEffect } = require('../../src/tram-one');

const html = registerHtml();

/**
 * This component changes the presentation and document title based on global state
 */
export default () => {
	const pageStore = useGlobalStore('STORE');
	useEffect(() => {
		document.title = pageStore.selected;
	});
	return html`
		<section class="ElementSwitcherSubSection">
			<span style="display: block;">${0 * pageStore.selected}</span>
			<span style="display: block;">${1 * pageStore.selected}</span>
			<span style="display: block;">${2 * pageStore.selected}</span>
			<span style="display: block;">${3 * pageStore.selected}</span>
			<span style="display: block;">${4 * pageStore.selected}</span>
			<span style="display: block;">${5 * pageStore.selected}</span>
			<span style="display: block;">${6 * pageStore.selected}</span>
			<span style="display: block;">${7 * pageStore.selected}</span>
			<span style="display: block;">${8 * pageStore.selected}</span>
			<span style="display: block;">${9 * pageStore.selected}</span>
			<span style="display: block;">${10 * pageStore.selected}</span>
			<span style="display: block;">${11 * pageStore.selected}</span>
			<span style="display: block;">${12 * pageStore.selected}</span>
			<span style="display: block;">${13 * pageStore.selected}</span>
			<span style="display: block;">${14 * pageStore.selected}</span>
			<span style="display: block;">${15 * pageStore.selected}</span>
		</section>
	`;
};
