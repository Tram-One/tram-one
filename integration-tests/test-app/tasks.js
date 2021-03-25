const { registerHtml, useStore } = require('../../src/tram-one')

const html = registerHtml()

/**
 * component to test url parameters
 */
module.exports = () => {
	const tasks = useStore([])
	const newTask = useStore({ label: `Task Number ${tasks.length}` })

	const addTask = () => {
		tasks.push(newTask.label)
	}

	const updateNewTask = (event) => {
		newTask.label = event.target.value
	}

	const taskList = tasks.map(task => html`<li>${task}</li>`)
	return html`
		<div>
			<label for="new-task-label">New Task Label</label>
			<p>${newTask.label.length} / 255</p>
			<input id="new-task-label" name="new-task-label" value=${newTask.label} oninput=${updateNewTask} tabindex="0" />
			<button onclick=${addTask}>Add New Task</button>
			<ul>
				${taskList}
			</ul>
		</div>
	`
}
