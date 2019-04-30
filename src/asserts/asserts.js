const assert = require('assert')

const undefinedCheck = (value) => (value === undefined || value === null)

const assertIsObject = (value, variable, orUndefined = false, shape = 'an object') => {
  if (orUndefined && undefinedCheck(value)) return
  assert.strict.equal(typeof value, 'object', `Tram-One: ${variable} should be ${shape}`)
  assert.ok(!(Array.isArray(value)), `Tram-One: ${variable} should be ${shape}`)
}

const assertIsString = (value, variable, orUndefined = false, shape = 'a string') => {
  if (orUndefined && undefinedCheck(value)) return
  assert.strict.equal(typeof value, 'string', `Tram-One: ${variable} should be ${shape}`)
}

const assertIsFunction = (value, variable, orUndefined = false, shape = 'a function') => {
  if (orUndefined && undefinedCheck(value)) return
  assert.strict.equal(typeof value, 'function', `Tram-One: ${variable} should be ${shape}`)
}

const assertIsDefined = (value, variable, shape = 'defined') => {
  assert.ok(!undefinedCheck(value), `Tram-One: ${variable} should be ${shape}`)
}

const assertGlobalSpaceAndEngine = (engineName) => (globalSpace, engineValue) => {
  assertIsObject(globalSpace, 'globalSpace', true)
  assertIsString(engineValue, engineName)
}

module.exports = { assertIsObject, assertIsString, assertIsFunction, assertIsDefined, assertGlobalSpaceAndEngine }
