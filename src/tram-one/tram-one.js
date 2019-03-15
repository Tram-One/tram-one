const { dom, html, svg } = require('../dom')
const { setupEngine, getEngine, addActions, addListener } = require('../engine')
const { useEffect, useState, useStore } = require('../hooks')
const { setupLog, getLog, clearLog } = require('../log')
const { mount } = require('../mount')
const { routeElement, switchElement } = require('../routing')
const { start } = require('../start')

module.exports = (globalSpace = window) => ({
  dom, html, svg,
  addActions: addActions(globalSpace),
  addListener: addListener(globalSpace),
  useEffect: useEffect(globalSpace),
  useState: useState(globalSpace),
  useStore: useStore(globalSpace),
  routeElement: routeElement(),
  switchElement: switchElement(),
  start: start(globalSpace)
})

module.exports.pantograph = {
  dom, html, svg,
  setupEngine, getEngine, addActions, addListener,
  useEffect, useState, useStore,
  setupLog, getLog, clearLog,
  mount,
  routeElement, switchElement,
  start
}
