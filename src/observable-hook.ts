import { TRAM_OBSERVABLE_STORE, TRAM_HOOK_KEY } from './engine-names'
import { getObservableStore } from './observable-store'
import { getWorkingKeyValue, incrementWorkingKeyBranch } from './working-key'

import { StoreObject } from './types'

/**
 * Shared source code for both observable hooks, useStore, and useGlobalStore.
 * This hook exposes a globally stored value (in either case), that can cause the component
 * to update when a subfield of that value is updated.
 *
 * It has a similar interface to React's useState
 */
export default <Store extends StoreObject>(key?: string, value?: Store) : Store => {
	// get the store of effects
	const observableStore = getObservableStore(TRAM_OBSERVABLE_STORE)

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY)

	// if a key was passed in, use that, otherwise, generate a key
	const resolvedKey = key || getWorkingKeyValue(TRAM_HOOK_KEY)

	// saves value into the store if it doesn't exist in the observableStore yet
	// and if the value we are writing is defined
	if (!Object.prototype.hasOwnProperty.call(observableStore, resolvedKey) && value !== undefined) {
		// save the value as a shallow copy of the parameter passed in
		observableStore[resolvedKey] = Array.isArray(value) ? [...value] : { ...value }
	}

	// get value for key
	const keyValue = observableStore[resolvedKey]

	// return value
	return keyValue
}
