import mount from './mount';
import buildContainer from './build-mounting-container';
import {
	TRAM_EFFECT_STORE,
	TRAM_HOOK_KEY,
	TRAM_EFFECT_QUEUE,
	TRAM_OBSERVABLE_STORE,
	TRAM_MUTATION_OBSERVER,
	TRAM_KEY_QUEUE,
	TRAM_KEY_STORE,
} from './engine-names';
import { setupTramOneSpace } from './namespace';
import { setupEffectStore } from './effect-store';
import { setupWorkingKey } from './working-key';
import { setupObservableStore } from './observable-store';
import { setupMutationObserver, startWatcher } from './mutation-observer';
import { ElementOrSelector, TramOneComponent } from './types';
import { setupKeyQueue } from './key-queue';
import { setupKeyStore } from './key-store';

/**
 * @name start
 * @link https://tram-one.io/#start
 * @description
 * Function to attach a component to an existing element on the page.
 * This function also starts all the listeners and allows the basic hooks to function.
 *
 * This should only be called for the initial render / building of the app.
 *
 * @param component top-level component to attach to the page.
 * @param target either a CSS selector, or Node to attach the component to
 */
export default (component: TramOneComponent, target: ElementOrSelector) => {
	/* setup all the internal engines required for tram-one to work */

	// get the container to mount the app on
	const container = buildContainer(target);

	// setup the window object to hold stores and queues
	// in the future, we may allow this to be customized
	// for multiple, sandboxed, instances of Tram-One
	setupTramOneSpace();

	// setup store for effects
	setupEffectStore(TRAM_EFFECT_STORE);

	// setup queue for new effects when resolving mounts
	setupEffectStore(TRAM_EFFECT_QUEUE);

	// setup working key for hooks
	setupWorkingKey(TRAM_HOOK_KEY);

	// setup observable store for the useStore and useGlobalStore hooks
	setupObservableStore(TRAM_OBSERVABLE_STORE);

	// setup key store for keeping track of stores to clean up
	setupKeyStore(TRAM_KEY_STORE);

	// setup key queue for new observable stores when resolving mounts
	setupKeyQueue(TRAM_KEY_QUEUE);

	// setup a mutation observer for cleaning up removed elements and triggering effects
	setupMutationObserver(TRAM_MUTATION_OBSERVER);

	// watch for changes on the target so that we can process node changes
	startWatcher(TRAM_MUTATION_OBSERVER, container);

	// trigger an initial mount
	mount(component, container);
};
