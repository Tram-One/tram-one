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
			<p>
				<label for="new-task-label">New Task Label</label> (${newTask.label.length} / 255)
				<br />
				<input id="new-task-label" name="new-task-label" value=${newTask.label} oninput=${updateNewTask} tabindex="0" />
			</p>

			<p>
				<label for="new-task-type">New Task Type</label> (${newTask.type.length} / 255)
				<br />
				<input
					id="new-task-type"
					name="new-task-type"
					value=${newTask.type}
					oninput=${updateNewTaskType}
					tabindex="0"
				/>
			</p>

			<button onclick=${addTask}>Add New Task</button>
			<ul>
				${taskList}
			</ul>
		</div>
	`;
};
