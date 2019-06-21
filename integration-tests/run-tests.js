const componentSpec = require('./specs/component-spec')
const routingSpec = require('./specs/routing-spec')
const sideEffectSpec = require('./specs/side-effect-spec')
const svgSpec = require('./specs/svg-spec')
const umdSpec = require('./specs/umd-spec')
const useGlobalSpec = require('./specs/use-global-spec')

const endSpec = require('./test-utilities/end-spec')

const runTests = async () => {
  try {
    const componentResults = await componentSpec()
    const routingResults = await routingSpec()
    const sideEffectResults = await sideEffectSpec()
    const svgResults = await svgSpec()
    const umdResults = await umdSpec()
    const useGlobalResults = await useGlobalSpec()

    const results = [
      componentResults,
      routingResults,
      sideEffectResults,
      svgResults,
      umdResults,
      useGlobalResults
    ].reduce((totalResults, resultList) => totalResults.concat(resultList))

    endSpec(results)
  } catch (error) {

  }
}

runTests()

