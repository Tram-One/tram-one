/*
 * The KeyStore in Tram-One is a basic key-value object
 * that needs to be persisted in the globalSpace.
 *
 * Currently this is used with useStore and useGlobalStore to keep
 * track of what stores need to be cleaned up when removing elements
 */

import { buildNamespace } from './namespace';
import { KeyObservers } from './types';

const newDefaultKeyStore = () => {
	return {} as KeyObservers;
};

export const { setup: setupKeyStore, get: getKeyStore, set: setKeyStore } = buildNamespace(newDefaultKeyStore);

/**
 * clear the key store
 * usually called when we want to empty the key store
 */
export const clearKeyStore = (keyStoreName: string) => {
	const keyStore = getKeyStore(keyStoreName);

	Object.keys(keyStore).forEach((key) => delete keyStore[key]);
};

/**
 * increment (or set initial value) for the keyStore
 */
export const incrementKeyStoreValue = (keyStoreName: string, key: string) => {
	const keyStore = getKeyStore(keyStoreName);
	keyStore[key] = keyStore[key] + 1 || 1;
};

/**
 * decrement a value in the keyStore
 */
export const decrementKeyStoreValue = (keyStoreName: string, key: string) => {
	const keyStore = getKeyStore(keyStoreName);
	keyStore[key]--;
};

/**
 * restore the key store to a previous value
 * usually used when we had to interrupt the processing of keys
 */
export const restoreKeyStore = setKeyStore;
