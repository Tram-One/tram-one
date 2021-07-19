const { getByText, getByLabelText, fireEvent, waitFor } = require('@testing-library/dom')
const { default: userEvent } = require('@testing-library/user-event')
const { startApp } = require('./test-app')

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

	// will be "Wait: NN.NNNNNNNN"
	return getByText(container, /Wait/).innerHTML.split(' ')[1]
}

/**
 * Takes in an object of performance metrics,
 * and returns max times, median times, and average times
 */
const getMeaningfulStats = (performanceObject) => {
	return Object.fromEntries(
		Object.entries(performanceObject).map(([count, times]) => {
			times.sort()

			const maxTime = times.slice(-1)[0]
			const medianTime = times[Math.floor(times.length/2)]
			const averageTime = (times.reduce((sum, time) => sum + time))/(times.length)

			return [count, { medianTime, averageTime, maxTime }]
		})
	)
}

describe('Tram-One - Performance Tests', () => {
	it('should render lots of elements quickly', async () => {
		// set the test to be element-rendering
		window.history.pushState({}, '', '/element-rendering')

		const {container} = startApp()

		// verify that the element-rendering test is up
		expect(container).toHaveTextContent('Element Rendering Example')

		const elementCounts = ['0010', '0050', '0100', '0500', '1000', '5000']

		// loop and log all the results
		const performanceResults = {}

		let renderCount = 1
		for(counts of elementCounts) {
			// initial render, to remove any lag associated with starting the app
			await testElementRenderer(container, counts, renderCount)
			performanceResults[counts] = []
			const initialRenderCount = renderCount+1
			const maxRenderCount = renderCount+50
			for(renderCount = initialRenderCount; renderCount <= maxRenderCount; renderCount++) {
				const result = await testElementRenderer(container, counts, renderCount)
				performanceResults[counts].push(parseFloat(result))
			}
		}

		expect(getMeaningfulStats(performanceResults)).toMatchSnapshot()
	})
})
