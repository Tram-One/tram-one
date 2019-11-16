const { assertGlobalSpaceAndEngine } = require('../asserts')
const { setup, get } = require('../namespace')

/**
 * Render lock is a boolean which is used to indicate whether we should
 * continue rendering or if a final render has already completed, if we should
 * abandon the outdated render.
 */

const setupRenderLock = setup(() => ({ shouldRender: true }))

const getRenderLock = get

const setRenderLock = (globalSpace, renderLockName, shouldRender) => {
	assertGlobalSpaceAndEngine('renderLockName', globalSpace, renderLockName)

	const renderLock = getRenderLock(globalSpace, renderLockName)

	// if there is no lock, return should render value
	if (!renderLock) return { shouldRender }

	renderLock.shouldRender = shouldRender

	return renderLock
}

module.exports = { setupRenderLock, getRenderLock, setRenderLock }
