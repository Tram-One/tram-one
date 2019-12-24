const { setup, get } = require('./namespace')

/**
 * @private
 * @description
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
 * @private
 * @description
 * push a new branch value, usually when we step into a new
 * custom component when mounting.
 */
const pushWorkingKeyBranch = (keyName, branch) => {
	const workingKey = getWorkingKey(keyName)
	workingKey.branch.push(branch)
	if (!workingKey.branchIndices[getWorkingBranch(keyName)]) {
		workingKey.branchIndices[getWorkingBranch(keyName)] = 0
	}
}

/**
 * @private
 * @description
 * pops the current branch value, usually when we are done mounting
 * a single child component.
 */
const popWorkingKeyBranch = keyName => {
	const workingKey = getWorkingKey(keyName)
	workingKey.branch.pop()
}

/**
 * @private
 * @description
 * increments the value for the current branch.
 * These values are used to pull the correct hook value on re-renders.
 */
const incrementWorkingKeyBranch = keyName => {
	const workingKey = getWorkingKey(keyName)
	workingKey.branchIndices[getWorkingBranch(keyName)] += 1
}

/**
 * @private
 * @description
 * used to get a unique string that will be used most likely in
 * a Hover Engine. This unique string _should_ be consistent over many
 * re-renders.
 */
const getWorkingKeyValue = keyName => {
	const workingKey = getWorkingKey(keyName)

	const index = workingKey.branchIndices[getWorkingBranch(keyName)]
	return `${getWorkingBranch(keyName)}[${index}]`
}

/**
 * @private
 * @description
 * returns a deep copy of the existing key, usually used as a restore point later
 */
const copyWorkingKey = keyName => {
	const key = getWorkingKey(keyName)
	return {
		branch: [...key.branch],
		branchIndices: { ...key.branchIndices }
	}
}

/**
 * @private
 * @description
 * if we needed to reset pre-emptively, use this to get back
 * to where the branches were before
 */
const restoreWorkingKey = (keyName, restoreKey) => {
	const key = getWorkingKey(keyName)
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
	copyWorkingKey,
	restoreWorkingKey
}
