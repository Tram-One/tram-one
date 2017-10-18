const Tram = require('../../tram-one')
const app = new Tram()

const Todos = require('./elements/Todos')
const Dones = require('./elements/Dones')
const NewTodo = require('./elements/NewTodo')

const TodoActions = require('./reducers/TodoActions')

const html = Tram.html({
  NewTodo,
  Todos,
  Dones
})

const home = (store, actions) => {
  return html`
    <div class="center">
      <h1> Tram-One 🚋 </h1>
      <h2> Todos App Example </h2>
      <a href="/todo">TODO</a> | <a href="/results">RESULTS</a>
    </div>
  `
}

const todo = (store, actions) => {
  const onUpdateInput = ({currentTarget: { value }}) => {
    actions.updateInput(value)
  }

  const onAddTodo = () => {
    actions.addTodo()
  }

  const onCompleteTodo = (index) => () => {
    actions.completeTodo(index)
  }

  return html`
    <div>
      <div class="center">
        <h1> Tram-One Todos 🚋 </h1>
        <a href="/">HOME</a> | <a href="/results">RESULTS</a>
      </div>
      <NewTodo  value=${store.todos.text}
                onUpdateInput=${onUpdateInput}
                onAddTodo=${onAddTodo}/>
      <Todos todos=${store.todos.todos}
             onCompleteTodo=${onCompleteTodo}/>
      <hr />
      <Dones dones=${store.todos.dones}/>
    </div>
  `
}

const results = (store, actions) => {
  const checked = store.todos.dones.length
  const unchecked = store.todos.todos.length
  
  return html`
    <div>
      <div class="center">
        <h1> Tram-One Results 🚋 </h1>
        <a href="/">HOME</a> | <a href="/todo">TODO</a>
      </div>
      <h4>Unchecked: ${unchecked}</h4>
      <h4>Checked: ${checked}</h4>
      <h4>Total: ${checked + unchecked}</h4>
    </div>
  `
}

app.addActions({todos: TodoActions})
app.addRoute('/', home)
app.addRoute('/todo', todo)
app.addRoute('/results', results)

app.engine.addListener((store) => {
  localStorage.setItem('todos', JSON.stringify(store.todos))
})

app.start('.main')
