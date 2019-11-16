const assert = require('assert')

/**
 * This file contains helper functions to verify that
 * functions have the correct data on runtime.
 */

/**
 * check if the value is undefined or null
 * @param {*} value - value to check
 * @returns {boolean} if the value is defined
 */
const undefinedCheck = value => (value === undefined || value === null)

/**
 * verify that value is an object, and throw an assert warning if it is not
 * @param {*} value - value to check
 * @param {string} variable - name of variable
 * @param {boolean} [orUndefined=false] - if being undefined is allowed
 * @param {string} [shape='an object'] - what the value should be (in words)
 *
 * @example
 * store = {'/': []}
 * assertIsObject(store, 'store', false, 'map of paths to values')
 */
const assertIsObject = (value, variable, orUndefined = false, shape = 'an object') => {
	if (orUndefined && undefinedCheck(value)) return
	assert.strictEqual(typeof value, 'object', `Tram-One: ${variable} should be ${shape}`)
	assert.ok(!(Array.isArray(value)), `Tram-One: ${variable} should be ${shape}`)
}

/**
 * verify that value is an array, and throw an assert warning if it is not
 * @param {*} value - value to check
 * @param {string} variable - name of variable
 * @param {boolean} [orUndefined=false] - if being undefined is allowed
 * @param {string} [shape='an object'] - what the value should be (in words)
 *
 * @example
 * triggers = []
 * assertIsArray(triggers, 'triggers', false, 'list of values')
 */
const assertIsArray = (value, variable, orUndefined = false, shape = 'an array') => {
	if (orUndefined && undefinedCheck(value)) return
	assert.strictEqual(typeof value, 'object', `Tram-One: ${variable} should be ${shape}`)
	assert.ok((Array.isArray(value)), `Tram-One: ${variable} should be ${shape}`)
}

/**
 * verify that value is a string, and throw an assert warning if it is not
 * @param {*} value - value to check
 * @param {string} variable - name of variable
 * @param {boolean} [orUndefined=false] - if being undefined is allowed
 * @param {string} [shape='a string'] - what the value should be (in words)
 *
 * @example
 * key = '1234'
 * assertIsString(key, 'key', false, 'a string of digits')
 */
const assertIsString = (value, variable, orUndefined = false, shape = 'a string') => {
	if (orUndefined && undefinedCheck(value)) return
	assert.strictEqual(typeof value, 'string', `Tram-One: ${variable} should be ${shape}`)
}

/**
 * verify that value is a string, and throw an assert warning if it is not
 * @param {*} value - value to check
 * @param {string} variable - name of variable
 * @param {boolean} [orUndefined=false] - if being undefined is allowed
 * @param {string} [shape='a string'] - what the value should be (in words)
 *
 * @example
 * key = '1234'
 * assertIsString(key, 'key', false, 'a string of digits')
 */
const assertIsFunction = (value, variable, orUndefined = false, shape = 'a function') => {
	if (orUndefined && undefinedCheck(value)) return
	assert.strictEqual(typeof value, 'function', `Tram-One: ${variable} should be ${shape}`)
}

/**
 * verify that value is defined, and throw an assert warning if it is not
 * @param {*} value - value to check
 * @param {string} variable - name of variable
 * @param {string} [shape='defined'] - what the value should be (in words)
 *
 * @example
 * key = '1234'
 * assertIsDefined(key, 'key', 'a string of digits')
 */
const assertIsDefined = (value, variable, shape = 'defined') => {
	assert.ok(!undefinedCheck(value), `Tram-One: ${variable} should be ${shape}`)
}

/**
 * validates that a globalSpace exists and that the engine value is defined
 * otherwise throw an assert error
 * @param {string} engineName - name of the engine
 * @param {object} globalSpace - globalSpace object
 * @param {*} engineValue - engine object
 */
const assertGlobalSpaceAndEngine = (engineName, globalSpace, engineValue) => {
	assertIsObject(globalSpace, 'globalSpace', true)
	assertIsString(engineValue, engineName)
}

module.exports = { assertIsObject, assertIsArray, assertIsString, assertIsFunction, assertIsDefined, assertGlobalSpaceAndEngine }
