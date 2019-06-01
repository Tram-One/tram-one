const { setup, get } = require('../namespace')
const { assertGlobalSpaceAndEngine, assertIsString, assertIsDefined } = require('../asserts')

/**
 * This file defines all the functions required to interact with
 * a working-key object. This working-key object is used to help
 * hooks understand where in the mounting process we are, and what
 * values or effects to pull / trigger.
 */

const setupWorkingKey = setup(() => ({
  // list of custom tags that we've stepped into
  branch: [],
  // map of branches to index value (used as a cursor for hooks)
  branchIndices: {
    '': 0
  }
}))

const getWorkingKey = get

const getWorkingBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  return getWorkingKey(globalSpace, keyName).branch.join('/')
}

/**
 * push a new branch value, usually when we step into a new
 * custom component when mounting.
 */
const pushWorkingKeyBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  return (branch) => {
    assertIsString(branch)
    const workingKey = getWorkingKey(globalSpace, keyName)
    assertIsDefined(workingKey, 'workingKey', 'setup, use setupWorkingKey')
    workingKey.branch.push(branch)
    if (!workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)]) {
      workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)] = 0
    }
  }
}

/**
 * pops the current branch value, usually when we are done mounting
 * a single child component.
 */
const popWorkingKeyBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  return () => {
    const workingKey = getWorkingKey(globalSpace, keyName)
    workingKey.branch.pop()
  }
}

/**
 * increments the value for the current branch.
 * These values are used to pull the correct hook value on re-renders.
 */
const incrementWorkingKeyBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const workingKey = getWorkingKey(globalSpace, keyName)
  workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)] += 1
}

/**
 * used to get a unique string that will be used most likely in
 * a Hover Engine. This unique string _should_ be consistent over many
 * re-renders.
 */
const getWorkingKeyValue = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const workingKey = getWorkingKey(globalSpace, keyName)
  if (!workingKey) return workingKey

  const index = workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)]
  return `${getWorkingBranch(globalSpace, keyName)}[${index}]`
}

/**
 * resets the counter for all branchs so that when `useState` is called again
 * it refers to the correct hook from the last time it was called
 */
const resetIndices = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const key = getWorkingKey(globalSpace, keyName)
  if (!key) return
  const branches = key.branchIndices
  Object.keys(getWorkingKey(globalSpace, keyName).branchIndices)
    .forEach((branch) => {
      branches[branch] = 0
    })
}

/**
 * returns a deep copy of the existing key, usually used as a restore point later
 */
const copyWorkingKey = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const key = getWorkingKey(globalSpace, keyName)
  if (!key) return
  return {
    branch: [...key.branch],
    branchIndices: {...key.branchIndices}
  };
}

/**
 * if we needed to reset pre-emptively, use this to get back
 * to where the branches were before
 */
const restoreIndices = (globalSpace, keyName, restoreKey) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const key = getWorkingKey(globalSpace, keyName)
  if (!key) return
  const branches = key.branchIndices
  Object.keys(getWorkingKey(globalSpace, keyName).branchIndices)
    .forEach((branch) => {
      branches[branch] = restoreKey.branchIndices[branch] || 0
    })
}

module.exports = {
  setupWorkingKey,
  pushWorkingKeyBranch,
  popWorkingKeyBranch,
  incrementWorkingKeyBranch,
  getWorkingKey,
  getWorkingBranch,
  getWorkingKeyValue,
  resetIndices,
  copyWorkingKey,
  restoreIndices
}
