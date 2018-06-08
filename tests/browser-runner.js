const tests = require('./specs/tram-spec')

const TramUMD = window['tram-one']
const testemPath = window.location.pathname
const document = window.document

tests(TramUMD, true, testemPath, document)
