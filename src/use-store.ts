import observableHook from './observable-hook'

import { StoreObject } from './types'

/**
 * @name useStore
 * @link https://tram-one.io/#use-store
 * @description
 * Hook that stores local component state.
 *
 * If the subfield of an object, or element of an array is updated
 * it will cause only the components that are dependent on that value to update.
 *
 * @param defaultValue the default value to start the store at
 *
 * @returns the store to interact with.
 */
export default <Store extends StoreObject>(defaultValue: Store) => observableHook(undefined, defaultValue)
