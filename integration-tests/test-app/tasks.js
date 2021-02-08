const { registerHtml, useStore } = require('../../src/tram-one')

const html = registerHtml()

/**
 * component to test url parameters
 */
module.exports = () => {
	const tasks = useStore([])
	const addTask = () => {
		tasks.push(`Task Number ${tasks.length}`)
	}

	const taskList = tasks.map(task => html`<li>${task}</li>`)
	return html`
		<div>
			<button onclick=${addTask}>Add New Task</button>
			<ul>
				${taskList}
			</ul>
		</div>
	`
}
