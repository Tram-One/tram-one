const { observable } = require('@nx-js/observer-util');

import { buildNamespace } from './namespace';

/*
 * Observable Stores in Tram-One are used for objects whose properties need to be observed.
 * This stores the values in the useStore and useGlobalStore hooks, internally tracking
 * them as proxies, and making observed functions respond to their changes.
 */

export const { setup: setupObservableStore, get: getObservableStore } = buildNamespace(() => observable({}));
