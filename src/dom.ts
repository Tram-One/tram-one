const nanohtml = require('@tram-one/nanohtml');
const rbel = require('@tram-one/rbel');
const hyperx = require('@tram-one/hyperx');

import { TRAM_HOOK_KEY } from './engine-names';
import {
	pushWorkingKeyBranch,
	popWorkingKeyBranch,
	incrementWorkingKeyBranch,
	copyWorkingKey,
	restoreWorkingKey,
} from './working-key';
import observeTag from './observe-tag';
import processEffects from './process-effects';
import { TRAM_TAG } from './node-names';

import { Registry, Props, DOMTaggedTemplateFunction } from './types';

/**
 * This function takes in a namespace and registry of custom components,
 * and builds a `dom` template tag function that can take in a template XML string.
 *
 * This function shouldn't need to be called directly, instead, you can use `registerHtml` or `registerSvg`
 *
 * @param namespace namespace to create nodes in (by default XHTML namespace)
 * @param registry mapping of tag names to component functions
 */
export const registerDom = (namespace: string, registry: Registry = {}): DOMTaggedTemplateFunction => {
	// modify the registry so that each component function updates the hook working key
	const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
		const tagFunction = registry[tagName];
		const hookedTagFunction = (props: Props, children: Element) => {
			// push a new branch onto the working key so any values that need to be unique among components
			// but consistent across renders can be read
			const stringifiedProps = JSON.stringify(props);
			const newBranch = `${tagName}[${stringifiedProps}]`;
			pushWorkingKeyBranch(TRAM_HOOK_KEY, newBranch);

			// increment branch so that we have a unique value (in case we are rendering a list of components)
			incrementWorkingKeyBranch(TRAM_HOOK_KEY);
			const uniqueBranch = copyWorkingKey(TRAM_HOOK_KEY);

			// create a tag function that has the args passed in
			const populatedTagFunction = () => {
				// reset working key so we have the correct place when starting a new component
				restoreWorkingKey(TRAM_HOOK_KEY, uniqueBranch);

				return tagFunction(props, children);
			};

			// observe store usage and process any new effects that were called when building the component
			const processEffectsAndBuildTagResult = () => processEffects(populatedTagFunction);
			const tagResult = observeTag(processEffectsAndBuildTagResult);

			// pop the branch off (since we are done rendering this component)
			popWorkingKeyBranch(TRAM_HOOK_KEY);

			// mark this node as a tram-one component (so we can filter on it later)
			tagResult[TRAM_TAG] = true;

			return tagResult;
		};

		return { ...newRegistry, [tagName]: hookedTagFunction };
	}, {});

	return rbel(hyperx, nanohtml(namespace), hookedRegistry);
};
