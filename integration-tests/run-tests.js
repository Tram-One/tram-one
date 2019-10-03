const componentSpec = require('./specs/component-spec')
const routingSpec = require('./specs/routing-spec')
const sideEffectSpec = require('./specs/side-effect-spec')
const svgSpec = require('./specs/svg-spec')
const umdSpec = require('./specs/umd-spec')
const updatedEffectSpec = require('./specs/updated-effect-spec')
const useGlobalSpec = require('./specs/use-global-spec')

const endSpec = require('./test-utilities/end-spec')

const runTests = async () => {
	try {
		const componentResults = await componentSpec()
		const routingResults = await routingSpec()
		const sideEffectResults = await sideEffectSpec()
		const svgResults = await svgSpec()
		const umdResults = await umdSpec()
		const updatedEffectResults = await updatedEffectSpec()
		const useGlobalResults = await useGlobalSpec()

		const results = [
			componentResults,
			routingResults,
			sideEffectResults,
			svgResults,
			umdResults,
			updatedEffectResults,
			useGlobalResults
		].reduce((totalResults, resultList) => totalResults.concat(resultList))

		endSpec(results)
	} catch (error) {
		throw error
	}
}

runTests()

