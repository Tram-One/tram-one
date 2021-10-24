import observableHook from './observable-hook';

import { StoreObject } from './types';

/**
 * @name useGlobalObservable
 * @link https://tram-one.io/#use-global-observable
 * @description
 * Hook that stores global state and makes it accessible in the entire app.
 *
 * If the subfield of an object, or element of an array is updated
 * it will cause only the components that are dependent on that value to update.
 *
 * @param key a unique string to write and read the global value
 * @param defaultValue the default value to start the store at
 *
 * @returns the store to interact with.
 */
function useGlobalStore<Store extends StoreObject>(key: string, defaultValue: Store): Store;
/**
 * @name useGlobalObservable
 * @link https://tram-one.io/#use-global-observable
 * @description
 * Hook that stores global state and makes it accessible in the entire app.
 *
 * If the subfield of an object, or element of an array is updated
 * it will cause only the components that are dependent on that value to update.
 *
 * @param key a unique string to write and read the global value
 *
 * @returns the store to interact with.
 */
function useGlobalStore(key: string): unknown;
/** Implementation of the two function definitions */
function useGlobalStore(key: string, defaultValue?): any {
	return observableHook(key, defaultValue);
}

export default useGlobalStore;
