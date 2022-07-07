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
import processHooks from './process-hooks';
import {
	TRAM_TAG,
	TRAM_TAG_NEW_EFFECTS,
	TRAM_TAG_CLEANUP_EFFECTS,
	TRAM_TAG_NAME,
	TRAM_TAG_PROPS,
	TRAM_TAG_CHILDREN,
} from './node-names';

import { Registry, Props, DOMTaggedTemplateFunction, Children, TramOneHTMLElement, TramOneSVGElement } from './types';

/**
 * This function takes in a namespace and registry of custom components,
 * and builds a `dom` template tag function that can take in a template XML string.
 *
 * This function shouldn't need to be called directly, instead, you can use `registerHtml` or `registerSvg`
 *
 * @param registry mapping of tag names to component functions
 * @param namespace namespace to create nodes in (by default XHTML namespace)
 */
export const registerDom = <ElementType extends TramOneHTMLElement | TramOneSVGElement>(
	namespace: string | null,
	registry: Registry = {}
) => {
	// modify the registry so that each component function updates the hook working key
	const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
		const tagFunction = registry[tagName];
		const hookedTagFunction = (props: Props, children: Children) => {
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

				const processedChildren: Children = children?.map((child: unknown | Element) => {
					if (child instanceof Element) return child;
					return `${child}`;
				});
				return tagFunction(props, processedChildren);
			};

			// observe store usage and process any new effects that were called when building the component
			const processHooksAndBuildTagResult = () => processHooks(populatedTagFunction);
			const tagResult = observeTag(processHooksAndBuildTagResult);

			// pop the branch off (since we are done rendering this component)
			popWorkingKeyBranch(TRAM_HOOK_KEY);

			// decorate the properties expected on TramOneElements (see node-names.ts)
			tagResult[TRAM_TAG] = true;
			// we won't decorate TRAM_TAG_REACTION, that needs to be done later when we observe the tag
			tagResult[TRAM_TAG_NEW_EFFECTS] = tagResult[TRAM_TAG_NEW_EFFECTS] || [];
			// cleanup effects will be populated when new effects are processed
			tagResult[TRAM_TAG_CLEANUP_EFFECTS] = [];

			// save properties for development debugging
			if (process.env.NODE_ENV === 'development') {
				tagResult[TRAM_TAG_NAME] = tagName;
				tagResult[TRAM_TAG_PROPS] = props;
				tagResult[TRAM_TAG_CHILDREN] = children;
			}

			return tagResult;
		};

		return { ...newRegistry, [tagName]: hookedTagFunction };
	}, {});

	return rbel(hyperx, nanohtml(namespace), hookedRegistry) as DOMTaggedTemplateFunction<ElementType>;
};
