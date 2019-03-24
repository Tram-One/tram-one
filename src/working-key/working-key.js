const { getEngine } = require('../engine')
const { assertGlobalSpaceAndEngine, assertIsString, assertIsDefined } = require('../asserts')

const assertEngine = assertGlobalSpaceAndEngine('keyName')

const setupWorkingKey = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  // we do not have a space to put our key
  if (!globalSpace) return false

  // if one already exists, return it
  if (globalSpace[keyName]) return globalSpace[keyName]

  globalSpace[keyName] = {
    branch: [],
    branchIndices: {
      '': 0
    }
  }
  return globalSpace[keyName]
}

const getWorkingKey = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  return getEngine(globalSpace, keyName)
}

const getWorkingBranch = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  return getWorkingKey(globalSpace, keyName).branch.join('/')
}

const pushWorkingKeyBranch = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

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

const popWorkingKeyBranch = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  return () => {
    const workingKey = getWorkingKey(globalSpace, keyName)
    workingKey.branch.pop()
  }
}

const incrementWorkingKeyBranch = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  const workingKey = getWorkingKey(globalSpace, keyName)
  workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)] += 1
}

const getWorkingKeyValue = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  const workingKey = getWorkingKey(globalSpace, keyName)
  if (!workingKey) return workingKey

  const index = workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)]
  return getWorkingBranch(globalSpace, keyName) + `${[index]}`
}

const resetIndicies = (globalSpace = window, keyName) => {
  assertEngine(globalSpace, keyName)

  const key = getWorkingKey(globalSpace, keyName)
  if (!key) return
  const branches = key.branchIndices
  Object.keys(getWorkingKey(globalSpace, keyName).branchIndices)
    .forEach((branch) => {
      branches[branch] = 0
    })
}

module.exports = { setupWorkingKey, pushWorkingKeyBranch, popWorkingKeyBranch, incrementWorkingKeyBranch, getWorkingKey, getWorkingKeyValue, resetIndicies }
