const { registerDom, registerHtml, registerSvg } = require('../dom')
const { setupEngine, getEngine, addActions, addListener } = require('../engine')
const { useEffect, useState, useEngine, useUrlParams, useGlobalState } = require('../hooks')
const { setupLog, getLog, clearLog } = require('../log')
const { mount } = require('../mount')
const { start } = require('../start')

module.exports = (globalSpace = window) => ({
  registerDom: registerDom(globalSpace),
  registerHtml: registerHtml(globalSpace),
  registerSvg: registerSvg(globalSpace),
  addActions: addActions(globalSpace),
  addListener: addListener(globalSpace),
  useEffect: useEffect(globalSpace),
  useState: useState(globalSpace),
  useEngine: useEngine(globalSpace),
  useGlobalState: useGlobalState(globalSpace),
  useUrlParams: useUrlParams(),
  start: start(globalSpace)
})

module.exports.pantograph = {
  registerDom, registerHtml, registerSvg,
  setupEngine, getEngine, addActions, addListener,
  useEffect, useState, useEngine, useUrlParams,
  setupLog, getLog, clearLog,
  mount,
  start
}
