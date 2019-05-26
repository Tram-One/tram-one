const { registerDom, registerHtml, registerSvg } = require('../dom')
const { useEffect, useState, useUrlParams, useGlobalState } = require('../hooks')
const { start } = require('../start')

const globalSpaceIsDefined = typeof tramSpace !== 'undefined'
const windowIsDefined = typeof window !== 'undefined'

const globalSpace = (() => {
  // by default, if tramSpace is set, use that as globalSpace
  if (globalSpaceIsDefined) return tramSpace

  // if a window exists, use that as the globalSpace
  if (windowIsDefined) return window

  // if tramSpace and window are undefined,
  // the functions can still operate without a globalSpace defined
  return undefined
})()

module.exports = {
  registerDom: registerDom(globalSpace),
  registerHtml: registerHtml(globalSpace),
  registerSvg: registerSvg(globalSpace),
  useEffect: useEffect(globalSpace),
  useState: useState(globalSpace),
  useGlobalState: useGlobalState(globalSpace),
  useUrlParams: useUrlParams(),
  start: start(globalSpace)
}
