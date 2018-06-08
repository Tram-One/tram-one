const tests = require('./specs/tram-spec')

// we won't always have this file built, so don't depend on it to pass lint
// eslint-disable-next-line import/no-unresolved
const TramESM = require('../dist/tram-one.esm')

const testemPath = '/'
const document = require('domino').createWindow().document

tests(TramESM, false, testemPath, document)
