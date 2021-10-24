import { registerHtml, useStore } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test url parameters
 */
export default () => {
	const tasks = useStore([]);
	const newTask = useStore({ label: `Task Number ${tasks.length}`, type: 'Projects' });

	const addTask = () => {
		tasks.push(newTask.label);
	};

	const updateNewTask = (event) => {
		newTask.label = event.target.value;
	};

	const updateNewTaskType = (event) => {
		newTask.type = event.target.value;
	};

	const taskList = tasks.map((task) => html`<li>${task}</li>`);
	return html`
		<div>
			<label for="new-task-label">New Task Label</label>
			<p>${newTask.label.length} / 255</p>
			<input id="new-task-label" name="new-task-label" value=${newTask.label} oninput=${updateNewTask} tabindex="0" />
			<label for="new-task-type">New Task Type</label>
			<p>${newTask.type.length} / 255</p>
			<input id="new-task-type" name="new-task-type" value=${newTask.type} oninput=${updateNewTaskType} tabindex="0" />
			<button onclick=${addTask}>Add New Task</button>
			<ul>
				${taskList}
			</ul>
		</div>
	`;
};
