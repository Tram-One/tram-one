const { setup, get } = require('../namespace')
const { assertGlobalSpaceAndEngine, assertIsString, assertIsDefined } = require('../asserts')

const setupWorkingKey = setup(() => ({
  branch: [],
  branchIndices: {
    '': 0
  }
}))

const getWorkingKey = get

const getWorkingBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  return getWorkingKey(globalSpace, keyName).branch.join('/')
}

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

const popWorkingKeyBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  return () => {
    const workingKey = getWorkingKey(globalSpace, keyName)
    workingKey.branch.pop()
  }
}

const incrementWorkingKeyBranch = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const workingKey = getWorkingKey(globalSpace, keyName)
  workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)] += 1
}

const getWorkingKeyValue = (globalSpace, keyName) => {
  assertGlobalSpaceAndEngine('keyName', globalSpace, keyName)

  const workingKey = getWorkingKey(globalSpace, keyName)
  if (!workingKey) return workingKey

  const index = workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)]
  return `${getWorkingBranch(globalSpace, keyName)}[${index}]`
}

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

module.exports = {
  setupWorkingKey,
  pushWorkingKeyBranch,
  popWorkingKeyBranch,
  incrementWorkingKeyBranch,
  getWorkingKey,
  getWorkingBranch,
  getWorkingKeyValue,
  resetIndices
}
