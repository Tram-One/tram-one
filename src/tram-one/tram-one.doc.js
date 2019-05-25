/* types */

/**
 * @typedef {object} GlobalSpace
 *
 * @description
 * Object where Tram-One will store internal store and state.
 * It is not recommended that you interact with this object directly.
 * When testing you can provide your own mock GlobalSpace, or if you
 * are running Tram-One on non-browser environments.
 *
 * @example
 * import { Tram } from 'tram-one'
 * const mockGlobalSpace = {}
 *
 *
 * const { registerHtml, start } = Tram(mockGlobalSpace)
 */

/* modules */

/**
 * @module Tram-One
 *
 * @description
 * This module exposes several functions which (by default) attach state on the window object.
 * If you want to attach state objects and listeners on a different object, use the Tram export.
 *
 * @example
 * import { registerHtml, start } from 'tram-one'
 */

/* methods */

/**
 * @name Tram
 * @function
 * @memberof Tram-One
 * @static
 *
 * @description
 * This function exposes the same set of functions available by default, but scaffolded with
 * a passed in object that Tram-One can place listeners and state objects. This is useful if
 * window is not available (such as when server-side-rendering).
 *
 * @param {GlobalSpace} [GlobalSpace=window] object that Tram-One uses to store data and listeners
 *
 * @returns {Tram-One} Tram-One set of functions
 *
 * @example
 * import { Tram } from 'tram-one'
 * const mockGlobalSpace = {}
 *
 *
 * const { registerHtml, start } = Tram(mockGlobalSpace)
 */
