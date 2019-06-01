const { assertGlobalSpaceAndEngine } = require('../asserts')
const { setup, get } = require('../namespace')

/**
 * Render tracker is a boolean which is used to indicate whether we should
 * continue rendering or if a final render has already completed, if we should
 * abandon the outdated render.
 */

const setupRenderTracker = setup(() => ({ shouldRender: true }))

const getRenderTracker = get

const setRenderTracker = (globalSpace, renderTrackerName, shouldRender) => {
  assertGlobalSpaceAndEngine('renderTrackerName', globalSpace, renderTrackerName)

  const renderTracker = getRenderTracker(globalSpace, renderTrackerName)

  // if there is no log store, return should render value
  if (!renderTracker) return { shouldRender }

  renderTracker.shouldRender = shouldRender

  return renderTracker
}

module.exports = { setupRenderTracker, getRenderTracker, setRenderTracker }
