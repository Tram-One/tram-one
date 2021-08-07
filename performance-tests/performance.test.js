/* eslint-disable no-await-in-loop */
// ^ disabled because interactions with the page can't be done in parallel

const { getByText, getByLabelText, waitFor } = require('@testing-library/dom')
const { default: userEvent } = require('@testing-library/user-event')
const { startApp } = require('./test-app')

// number of times to run the test
const NUMBER_OF_RUNS = 50
// the number of tests to toss (slowest and fastest)
const BUFFER = 10

/**
 * This function helps test the element-renderer page, by setting the count, and hitting the render button
 * @returns how long it took to render the elements
 */
const testElementRenderer = async (container, count, renders) => {
	// setup {count} elements
	userEvent.type(getByLabelText(container, 'Element Count'), '{selectall}{backspace}')
	userEvent.type(getByLabelText(container, 'Element Count'), `${count}`)

	// verify the count is {count}
	await waitFor(() => {
		expect(getByLabelText(container, 'Element Count')).toHaveValue(`${count}`)
	})

	// click to trigger the render
	userEvent.click(getByText(container, 'Render'))

	// wait for the render button data to udpate
	await waitFor(() => {
		expect(getByText(container, 'Render')).toHaveAttribute('renders', `${renders}`)
	})

	// will be a string like "Wait: 12.3456789", and we just take the number
	return getByText(container, /Wait/).innerHTML.split(' ')[1]
}

/**
 * Takes in an object of performance metrics,
 * and returns max times, median times, and average times
 */
const getMeaningfulStats = performanceObject => {
	return Object.fromEntries(
		Object.entries(performanceObject).map(([count, times]) => {
			times.sort()

			// we remove the fastest few, and the slowest few, to get the least error prone results
			const meaningfulTimes = times.slice(BUFFER, -BUFFER)

			// get the fastest time
			const fastestTime = meaningfulTimes[0]
			// get the slowest time
			const slowestTime = meaningfulTimes.slice(-1)[0]
			// get the median (aka 50 percentile, aka the middle one)
			const medianTime = meaningfulTimes[Math.floor(meaningfulTimes.length / 2)]
			// get the average time (not a real time that showed up, but the average among times)
			const averageTime = (meaningfulTimes.reduce((sum, time) => sum + time)) / (meaningfulTimes.length)

			return [count, { medianTime, averageTime, slowestTime, fastestTime }]
		})
	)
}

describe('Tram-One - Performance Tests', () => {
	it('should render lots of elements quickly', async () => {
		// set the test to be element-rendering
		window.history.pushState({}, '', '/element-rendering')

		const { container } = startApp()

		// verify that the element-rendering test is up
		expect(container).toHaveTextContent('Element Rendering Example')

		// the number of elements that we will try to render
		const elementCounts = ['0010', '0050', '0100', '0500', '1000', '5000']

		// store all the results in this object
		const performanceResults = {}

		// loop through all the number of elements that we want to test
		let renderCount = 1
		for (const counts of elementCounts) {
			// initial render, to remove any lag associated with starting the app
			await testElementRenderer(container, counts, renderCount)

			performanceResults[counts] = []

			const initialRenderCount = renderCount + 1
			const maxRenderCount = renderCount + NUMBER_OF_RUNS
			for (renderCount = initialRenderCount; renderCount <= maxRenderCount; renderCount++) {
				// we need to run each test one at a time
				const result = await testElementRenderer(container, counts, renderCount)

				// push the results to the performanceResults
				performanceResults[counts].push(Number.parseFloat(result))
			}
		}

		// save results to a snapshot (these can be updated always)
		// they are more of a reference to look back on
		const stats = getMeaningfulStats(performanceResults)
		expect(stats).toMatchSnapshot()

		// what does quickly mean? 5x elements should not be more than 5x slower
		// we'll use the average, since that should be the least error prone (with the outliers removed)
		// we'll also add a buffer to the right, to account for fragility
		const buffer = 1 // 1 seconds, which will map to 5 seconds on the left
		expect(stats['0050'].averageTime / 5).not.toBeGreaterThan(stats['0010'].averageTime + buffer)
		expect(stats['0500'].averageTime / 5).not.toBeGreaterThan(stats['0100'].averageTime + buffer)
		expect(stats['5000'].averageTime / 5).not.toBeGreaterThan(stats['1000'].averageTime + buffer)
	})
})
