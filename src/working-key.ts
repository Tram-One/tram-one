import { buildNamespace } from './namespace';
import { WorkingkeyObject } from './types';

/*
 * This file defines all the functions required to interact with
 * a working-key object. This working-key object is used to help
 * hooks understand where in the mounting process we are, and what
 * values or effects to pull / trigger.
 */

const defaultWorkingKey = {
	// list of custom tags that we've stepped into
	branch: [],
	// map of branches to index value (used as a cursor for hooks)
	branchIndices: {
		'': 0,
	},
} as WorkingkeyObject;

export const { setup: setupWorkingKey, get: getWorkingKey } = buildNamespace(() => defaultWorkingKey);

const getWorkingBranch = (keyName: string) => {
	const workingkeyObject = getWorkingKey(keyName);
	return workingkeyObject.branch.join('/');
};

/**
 * push a new branch value, usually when we step into a new
 * custom component when mounting.
 */
export const pushWorkingKeyBranch = (keyName: string, branch: string) => {
	const workingKey = getWorkingKey(keyName);
	workingKey.branch.push(branch);
	if (!workingKey.branchIndices[getWorkingBranch(keyName)]) {
		workingKey.branchIndices[getWorkingBranch(keyName)] = 0;
	}
};

/**
 * pops the current branch value, usually when we are done mounting
 * a single child component.
 */
export const popWorkingKeyBranch = (keyName: string) => {
	const workingKey = getWorkingKey(keyName);
	workingKey.branch.pop();
};

/**
 * increments the value for the current branch.
 * These values are used to pull the correct hook value on re-renders.
 */
export const incrementWorkingKeyBranch = (keyName: string) => {
	const workingKey = getWorkingKey(keyName);
	workingKey.branchIndices[getWorkingBranch(keyName)] += 1;
};

/**
 * used to get a unique string that will be used as a key for observables and effects.
 * This unique string _should_ be consistent over many re-renders.
 */
export const getWorkingKeyValue = (keyName: string) => {
	const workingKey = getWorkingKey(keyName);

	const index = workingKey.branchIndices[getWorkingBranch(keyName)];
	return `${getWorkingBranch(keyName)}[${index}]`;
};

/**
 * returns a deep copy of the existing key, usually used as a restore point later
 */
export const copyWorkingKey = (keyName: string) => {
	const key = getWorkingKey(keyName);
	return {
		branch: [...key.branch],
		branchIndices: { ...key.branchIndices },
	};
};

/**
 * if we needed to reset pre-emptively, use this to get back
 * to where the branches were before
 */
export const restoreWorkingKey = (keyName: string, restoreKey: WorkingkeyObject) => {
	const key = getWorkingKey(keyName);
	const branches = key.branchIndices;

	key.branch = [...restoreKey.branch];

	const resetBranchValue = (branch: string) => {
		branches[branch] = restoreKey.branchIndices[branch] || 0;
	};
	Object.keys(key.branchIndices).forEach(resetBranchValue);
};
