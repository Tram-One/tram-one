const morph = require('tatermorph')

const { TRAM_EFFECT_STORE, TRAM_HOOK_KEY } = require('../engine-names')
const { getLog, clearLog } = require('../log')
const { resetIndicies } = require('../working-key')
const { assertIsObject, assertIsDefined, assertIsFunction } = require('../asserts')

/**
 * internal method for building and updating / creating the app
 * - do not call this to start your app
 * - for complete documentation, please refer to http://tram-one.io/#app-mount
 *
 * @param {*} selector
 * @param {string} [pathName]
 * @param {object} store
 * @param {object} actions
 */
const mount = (globalSpace = window, effectStore = TRAM_EFFECT_STORE, workingKeyName = TRAM_HOOK_KEY) => {
  assertIsObject(globalSpace, 'globalSpace', true)

  return (selector, component) => {
    assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
    assertIsFunction(component, 'component')

    // if the selector is a string, try to find the element,
    // otherwise it's probably DOM that we should write directly to
    const target = (typeof selector) === 'string' ? document.querySelector(selector) : selector
    if (target === null) {
      console.warn('Tram-One: could not find target, is the element on the page yet?')
    }

    // build a div to render the app on
    // (if it doesn't exist as a child of the selector, create one first)
    if (!target.firstElementChild) {
      const targetChild = document.createElement('div')
      target.appendChild(targetChild)
    }
    const targetChild = target.firstElementChild

    // collect all the DOM events that we should be keeping track of.
    // these events are provided by belit and consumed by tatermorph.
    // (events are strange and actually aren't natively stored on Nodes,
    // but we have to keep track of them so we can know to add or
    // remove them between renders)
    const getEvents = (newNode, oldNode) => {
      return [].concat(newNode.events).concat(oldNode.events)
    }

    // save all the mount effects that have happened, and wipe the effectStore
    const existingEffects = Object.assign({}, getLog(globalSpace, effectStore))
    clearLog(globalSpace, effectStore)

    // update our child element with a new version of the app
    // tatermorph knows how to intelligently trigger only diffs that matter on the page
    morph(targetChild, component(), getEvents)

    // get the effects that are new
    const allNewEffects = Object.assign({}, getLog(globalSpace, effectStore))

    // split out effects between existing, new and removed
    const existingEffectKeys = Object.keys(allNewEffects).filter(effect => (effect in existingEffects))
    const newEffectKeys = Object.keys(allNewEffects).filter(effect => !(effect in existingEffects))
    const removedEffectKeys = Object.keys(existingEffects).filter(effect => !(effect in allNewEffects))

    // run all clean up effects if the effect was removed
    removedEffectKeys.forEach(effectKey => existingEffects[effectKey]())

    // add any effects that should be in the store back in
    existingEffectKeys.forEach(effectKey => {
      getLog(globalSpace, effectStore)[effectKey] = existingEffects[effectKey]
    })

    // run all new effects that we haven't seen before
    // save any cleanup effects in the effectStore
    newEffectKeys.forEach(effectKey =>
      getLog(globalSpace, effectStore)[effectKey] = allNewEffects[effectKey]()
    )

    // if we used any working keys for hooks, clear them out now
    resetIndicies(globalSpace, workingKeyName)
  }
}

module.exports = { mount }
