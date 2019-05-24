const { registerDom, registerHtml, registerSvg } = require('../dom')
const { addActions, addListener } = require('../engine')
const { useEffect, useState, useEngine, useUrlParams, useGlobalState } = require('../hooks')
const { start } = require('../start')

module.exports = {
  registerDom: registerDom(window),
  registerHtml: registerHtml(window),
  registerSvg: registerSvg(window),
  addActions: addActions(window),
  addListener: addListener(window),
  useEffect: useEffect(window),
  useState: useState(window),
  useEngine: useEngine(window),
  useGlobalState: useGlobalState(window),
  useUrlParams: useUrlParams(),
  start: start(window)
}

module.exports.Tram = (globalSpace = window) => ({
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
