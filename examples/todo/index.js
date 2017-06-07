const Tram = require('../../index');
const app = new Tram();
const Todo = require('./Todo');
const Done = require('./Done');
const AddButton = require('./AddButton');
const TodoInput = require('./TodoInput');

const html = Tram.html({
  Todo,
  Done,
  AddButton,
  TodoInput
});

const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return Object.assign({}, state, {
        todos: state.todos.concat(state.text),
        text: ''
      });
    case 'COMPLETE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.filter(
          (item, index) => index !== action.index
        ),
        dones: state.dones.concat(state.todos[action.index])
      })
    case 'EDIT_INPUT':
      return Object.assign({}, state, {
        text: action.text
      });
    default:
      return state;
  }
}

const home = (state) => {
  console.log(state);

  const onUpdateInput = ({currentTarget : { value }}) => {
    state.dispatch({
      type: 'EDIT_INPUT',
      text: value
    });
  }

  const onAddTodo = () => {
    state.dispatch({
      type: 'ADD_TODO'
    });
  }

  const onComplete = (index) => {
    state.dispatch({
      type: 'COMPLETE_TODO',
      index: index
    })
  }

  const renderTodo = (todo, index) => {
    return html`
      <Todo
        value=${todo}
        index=${index}
        onComplete=${onComplete.bind(this, index)}
      >
      </Todo>
    `
  }

  const renderDone = (done) => {
    return html`
      <Done
        value=${done}
      >
      </Done>
    `
  }

  const todoItems = state.todos.todos.map(renderTodo);
  const doneItems = state.todos.dones.map(renderDone);

  return html`
    <div>
      ${todoItems}
      <div>
        <TodoInput onUpdateInput=${onUpdateInput}>
        </TodoInput>
        <AddButton onAddTodo=${onAddTodo}>
        </AddButton>
      </div>
      <hr />
      ${doneItems}
    </div>
  `
}

const nopath = () => {
  return html`
    <div>
      404!
    </div>
  `
}
app.addReducer('todos', todoReducer, {
  todos: [], dones: [], text: ''
});
app.addRoute('/', home);
app.addRoute('/404', nopath);

app.start('.main');
