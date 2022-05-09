const { registerHtml, useGlobalStore, useStore } = require('../../src/tram-one');
import ElementSwitcher from './element-switcher-sub-section';
import ElementStore from './element-switcher-store';

const html = registerHtml({
	ElementSwitcher,
	ElementStore,
});

/**
 * This page controls and switches rendering based on what's selected
 */
export default () => {
	const pageStore = useGlobalStore('STORE', { selected: 1 });
	const switchStore = useStore({ id: 0 });

	const changeSelection = (newSelection: number) => () => {
		pageStore.selected = newSelection;
	};

	const startAutoSwitch = () => {
		switchStore.id = setInterval(() => {
			(
				(document.querySelector('nav button[selected] + button') as HTMLButtonElement) ||
				(document.querySelector('nav button:first-of-type') as HTMLButtonElement)
			).click();
		}, 500);
	};

	const stopAutoSwitch = () => {
		clearInterval(switchStore.id);
		switchStore.id = 0;
	};

	const cycle = switchStore.id
		? html`<button onclick=${stopAutoSwitch}>Stop</button>`
		: html`<button onclick=${startAutoSwitch}>Cycle</button>`;

	const storeElements = [...new Array(pageStore.selected)].map(() => {
		return html`<ElementStore />`;
	});

	return html`
		<section class="ElementSwitcher">
			<h1>Element Switching Example</h1>
			${cycle}
			<nav style="display: flex;">
				<button ${pageStore.selected === 1 ? 'selected' : ''} onclick=${changeSelection(1)}>1</button>
				<button ${pageStore.selected === 2 ? 'selected' : ''} onclick=${changeSelection(2)}>2</button>
				<button ${pageStore.selected === 3 ? 'selected' : ''} onclick=${changeSelection(3)}>3</button>
				<button ${pageStore.selected === 4 ? 'selected' : ''} onclick=${changeSelection(4)}>4</button>
				<button ${pageStore.selected === 5 ? 'selected' : ''} onclick=${changeSelection(5)}>5</button>
			</nav>
			${storeElements}
			<ElementSwitcher />
		</section>
	`;
};
