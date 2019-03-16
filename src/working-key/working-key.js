const { getEngine } = require('../engine')

const setupWorkingKey = (globalSpace = window, keyName) => {
  // we do not have a space to put our key
  if (!globalSpace) return false

  globalSpace[keyName] = {
    branch: [],
    branchIndices: {
      '': 0
    }
  }
  return globalSpace[keyName]
}

const getWorkingKey = (globalSpace = window, keyName) => {
  return getEngine(globalSpace, keyName)
}

const getWorkingBranch = (globalSpace = window, keyName) => {
  return getWorkingKey(globalSpace, keyName).branch.join('/')
}

const pushWorkingKeyBranch = (globalSpace = window, keyName) => {
  return (branch) => {
    const workingKey = getWorkingKey(globalSpace, keyName)
    workingKey.branch.push(branch)
    workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)] = 0
  }
}

const popWorkingKeyBranch = (globalSpace = window, keyName) => {
  return () => {
    const workingKey = getWorkingKey(globalSpace, keyName)
    workingKey.branch.pop()
  }
}

const incrementWorkingKeyBranch = (globalSpace = window, keyName) => {
  const workingKey = getWorkingKey(globalSpace, keyName)
  workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)] += 1
}

const getWorkingKeyValue = (globalSpace = window, keyName) => {
  const workingKey = getWorkingKey(globalSpace, keyName)
  const index = workingKey.branchIndices[getWorkingBranch(globalSpace, keyName)]
  return getWorkingBranch(globalSpace, keyName) + `${[index]}`
}

const resetIndicies = (globalSpace = window, keyName) => {
  const branches = getWorkingKey(globalSpace, keyName).branchIndices
  Object.keys(getWorkingKey(globalSpace, keyName).branchIndices)
    .forEach((branch) => {
      branches[branch] = 0
    })
}

module.exports = { setupWorkingKey, pushWorkingKeyBranch, popWorkingKeyBranch, incrementWorkingKeyBranch, getWorkingKeyValue, resetIndicies }
