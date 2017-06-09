const Tram = require('../../index')
const app = new Tram()

const Todos = require('./elements/Todos')
const Dones = require('./elements/Dones')
const NewTodo = require('./elements/NewTodo')

const TodoReducer = require('./reducers/TodoReducer')

const html = Tram.html({
  NewTodo,
  Todos,
  Dones
})

const home = (state) => {
  const onUpdateInput = ({currentTarget: { value }}) => {
    state.dispatch({
      type: 'UPDATE_INPUT',
      text: value
    })
  }

  const onAddTodo = () => {
    state.dispatch({
      type: 'ADD_TODO'
    })
  }

  const onCompleteTodo = (index) => () => {
    state.dispatch({
      type: 'COMPLETE_TODO',
      index: index
    })
  }

  return html`
    <div>
      <h1> Tram-One Todos 🚋 </h1>
      <NewTodo  value=${state.todos.text}
                onUpdateInput=${onUpdateInput}
                onAddTodo=${onAddTodo}>
      </NewTodo>
      <Todos todos=${state.todos.todos}
             onCompleteTodo=${onCompleteTodo}>
      </Todos>
      <hr />
      <Dones dones=${state.todos.dones}>
      </Dones>
    </div>
  `
}

app.addReducer('todos', TodoReducer, {
  todos: [], dones: [], text: ''
})
app.addRoute('/', home)

app.start('.main')
