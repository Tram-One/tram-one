import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

type Tasks = string[];

/**
 * component to test url parameters
 */
const tasks: TramOneComponent = () => {
	const tasks = useStore([] as Tasks);
	const newTask = useStore({ label: `Task Number ${tasks.length}`, type: 'Projects' });

	const addTask = () => {
		tasks.push(newTask.label);
	};

	const updateNewTask = (event: Event) => {
		newTask.label = (event.target as HTMLInputElement).value;
	};

	const updateNewTaskType = (event: Event) => {
		newTask.type = (event.target as HTMLInputElement).value;
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

export default tasks;
