const { setup, get } = require('../namespace')
const { assertIsString, assertIsDefined } = require('../asserts')

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

const getWorkingBranch = keyName => {
	return getWorkingKey(keyName).branch.join('/')
}

/**
 * push a new branch value, usually when we step into a new
 * custom component when mounting.
 */
const pushWorkingKeyBranch = (keyName, branch) => {
	assertIsString(branch)
	const workingKey = getWorkingKey(keyName)
	assertIsDefined(workingKey, 'workingKey', 'setup, use setupWorkingKey')
	workingKey.branch.push(branch)
	if (!workingKey.branchIndices[getWorkingBranch(keyName)]) {
		workingKey.branchIndices[getWorkingBranch(keyName)] = 0
	}
}

/**
 * pops the current branch value, usually when we are done mounting
 * a single child component.
 */
const popWorkingKeyBranch = keyName => {
	const workingKey = getWorkingKey(keyName)
	workingKey.branch.pop()
}

/**
 * increments the value for the current branch.
 * These values are used to pull the correct hook value on re-renders.
 */
const incrementWorkingKeyBranch = keyName => {
	const workingKey = getWorkingKey(keyName)
	workingKey.branchIndices[getWorkingBranch(keyName)] += 1
}

/**
 * used to get a unique string that will be used most likely in
 * a Hover Engine. This unique string _should_ be consistent over many
 * re-renders.
 */
const getWorkingKeyValue = keyName => {
	const workingKey = getWorkingKey(keyName)
	if (!workingKey) return workingKey

	const index = workingKey.branchIndices[getWorkingBranch(keyName)]
	return `${getWorkingBranch(keyName)}[${index}]`
}

/**
 * resets the counter for all branchs so that when `useState` is called again
 * it refers to the correct hook from the last time it was called
 */
const resetWorkingKey = keyName => {
	const key = getWorkingKey(keyName)
	if (!key) return
	const branches = key.branchIndices
	getWorkingKey(keyName).branch = []
	Object.keys(getWorkingKey(keyName).branchIndices)
		.forEach(branch => {
			branches[branch] = 0
		})
}

/**
 * returns a deep copy of the existing key, usually used as a restore point later
 */
const copyWorkingKey = keyName => {
	const key = getWorkingKey(keyName)
	if (!key) return
	return {
		branch: [...key.branch],
		branchIndices: { ...key.branchIndices }
	}
}

/**
 * if we needed to reset pre-emptively, use this to get back
 * to where the branches were before
 */
const restoreWorkingKey = (keyName, restoreKey) => {
	const key = getWorkingKey(keyName)
	if (!key) return
	const branches = key.branchIndices
	getWorkingKey(keyName).branch = [...restoreKey.branch]
	Object.keys(getWorkingKey(keyName).branchIndices)
		.forEach(branch => {
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
	resetWorkingKey,
	copyWorkingKey,
	restoreWorkingKey
}
