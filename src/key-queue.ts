/*
 * The KeyQueue in Tram-One is a basic list of keys
 * that needs to be persisted in the globalSpace.
 *
 * Currently this is used with useStore to keep track of what
 * stores need to be associated with generated elements
 */

import { buildNamespace } from './namespace';

const newDefaultKeyQueue = () => {
	return [] as string[];
};

export const { setup: setupKeyQueue, get: getKeyQueue, set: setKeyQueue } = buildNamespace(newDefaultKeyQueue);

/**
 * clear the key queue
 * usually called when we want to empty the key queue
 */
export const clearKeyQueue = (keyQueueName: string) => {
	const keyQueue = getKeyQueue(keyQueueName);

	keyQueue.splice(0, keyQueue.length);
};

/**
 * restore the key queue to a previous value
 * usually used when we had to interrupt the processing of keys
 */
export const restoreKeyQueue = setKeyQueue;
