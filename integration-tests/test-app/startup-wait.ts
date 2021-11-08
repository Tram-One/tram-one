import { registerHtml, useStore, useEffect, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test effects on mount
 */
const startupWait: TramOneComponent = () => {
	const initialWait = useStore({ isDone: false });

	// after the element first renders, run effect to set isDone to true
	useEffect(() => {
		initialWait.isDone = true;
	});

	return html`
		<p class="startup-wait" role="is-page-loading">The page is ${initialWait.isDone ? 'done' : 'loading'}.</p>
	`;
};

export default startupWait;
