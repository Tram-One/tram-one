const nanohtml = require('@tram-one/nanohtml');
const rbel = require('@tram-one/rbel');
const hyperx = require('@tram-one/hyperx');

/**
 * This function takes in a registry of custom components,
 * and builds a `dom` template tag function that can take in a template XML string.
 *
 * @param registry mapping of tag names to component functions
 */
export const registerDom = (registry = {}) => {
	// modify the registry so that each component function updates the hook working key
	const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
		const tagFunction = registry[tagName];

		// when we export tag functions, we wrap them with
		// a function to give them special observed props
		const observedTagFunction = (props, children) => {
			// make a proxy props object that when updated
			// will set attributes on elements
			const observedProps = new Proxy(props, {
				get(obj, prop) {
					try {
						// try to parse as an object or number
						return JSON.parse(obj[prop]);
					} catch {
						// if it's actually a string, return that
						return Reflect.get(...arguments);
					}
				},
				set(obj, prop, value) {
					// special attribute 'tram-element' to set what the dom that this proxy mutates
					if (prop === 'tram-element') {
						// no changes required... for now...
					} else {
						if (obj['tram-element'] === undefined) {
							console.warn('element does not exist yet');
						} else {
							// -- for all other props, look for the attributes in this tram-element --
							const attributeSelector = `[${String(prop)}]`;
							// check if we need to include this element
							const doesTramElementMatch = obj['tram-element'].matches(attributeSelector);
							const tramElementChildren = obj['tram-element'].querySelectorAll(attributeSelector);
							[...(doesTramElementMatch ? [obj['tram-element']] : []), ...tramElementChildren].forEach((element) => {
								const needsStringification = typeof value !== 'string';
								element.setAttribute(String(prop), needsStringification ? JSON.stringify(value) : value);
							});
						}
					}

					return Reflect.set(...arguments);
				},
			});

			// create the resulting dom
			// (pass in observedProps, so that mutations trigger proxy-effects)
			const result = tagFunction(observedProps, children);
			observedProps['tram-element'] = result;

			// read through all props for this element and its childrent
			[result, ...result.querySelectorAll('*')].forEach((element) => {
				[...element.attributes].forEach((attribute) => {
					// populate props object with attributes from the elements
					observedProps[attribute.name] = attribute.value;
				});
			});

			// trigger all the `onupdate` effects (to set initial values)
			[...result.querySelectorAll('*')]
				.filter((element) => element.events?.includes('onupdate'))
				.forEach((element) => element.onupdate({ target: element }));

			// set up a mutation effect to trigger 'onupdate' events when
			// attributes are updated
			const observeAttrChanges = (mutationList: MutationRecord[]) => {
				mutationList.forEach((mutationRecord) => {
					if ((mutationRecord.target as any).events?.includes('onupdate')) {
						(mutationRecord.target as any).onupdate({ target: mutationRecord.target });
					}
				});
			};

			// setup the mutation observer on the resulting dom
			const attributeObserver = new MutationObserver(observeAttrChanges);
			attributeObserver.observe(result, { attributes: true, subtree: true });

			// return the final result dom
			return result;
		};

		return { ...newRegistry, [tagName]: observedTagFunction };
	}, {});

	return rbel(hyperx, nanohtml(), hookedRegistry);
};
