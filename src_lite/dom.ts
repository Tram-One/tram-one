const nanohtml = require('@tram-one/nanohtml');
const rbel = require('@tram-one/rbel');
const hyperx = require('@tram-one/hyperx');

/**
 * This function takes in a namespace and registry of custom components,
 * and builds a `dom` template tag function that can take in a template XML string.
 *
 * This function shouldn't need to be called directly, instead, you can use `registerHtml` or `registerSvg`
 *
 * @param registry mapping of tag names to component functions
 * @param namespace namespace to create nodes in (by default XHTML namespace)
 */
export const registerDom = (registry = {}) => {
	// modify the registry so that each component function updates the hook working key
	const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
		const tagFunction = registry[tagName];

		const observedTagFunction = (props, children) => {
			// make a proxy object to update props with
			const observedProps = new Proxy(props, {
				set(obj, prop, value) {
					[...document.querySelectorAll(`[${String(prop)}]`)].forEach((element) => {
						element.setAttribute(String(prop), value);
					});
					return Reflect.set(...arguments);
				},
			});

			// create the resulting dom
			// (pass in observedProps, so that mutations trigger proxy-effects)
			const result = tagFunction(observedProps, children);

			// read through all props
			[...result.querySelectorAll('*')].forEach((element) => {
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
