const Tram = require('../../tram-one')
const app = new Tram()

const Dones = require('./elements/Dones')
const HeaderPage = require('./elements/HeaderPage')
const NavRoutes = require('./elements/NavRoutes')
const NewTodo = require('./elements/NewTodo')
const Todos = require('./elements/Todos')

const TodoActions = require('./reducers/TodoActions')

const html = Tram.html({
  Dones,
  HeaderPage,
  NavRoutes,
  NewTodo,
  Todos
})

const home = (store, actions) => {
  const routes = [
    {route: '/todo', name: 'TODO'},
    {route: '/completed', name: 'COMPLETED TODO'},
    {route: '/results', name: 'RESULTS'}
  ]
  
  return html`
    <div class="center">
      <HeaderPage 
        title="Tram-One" 
        subtitle="Home Page" />
      <NavRoutes routes=${routes} />
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

  const routes = [
    {route: '/', name: 'HOME'},
    {route: '/completed', name: 'COMPLETED TODO'},
    {route: '/results', name: 'RESULTS'}
  ]

  return html`
    <div>
      <div class="center">
        <HeaderPage 
          title="Tram-One Todos"
          subtitle="Todo Page" />
        <NavRoutes routes=${routes} />
      </div>
      <hr />
      <NewTodo  value=${store.todos.text}
                onUpdateInput=${onUpdateInput}
                onAddTodo=${onAddTodo}/>
      <Todos todos=${store.todos.todos}
             onCompleteTodo=${onCompleteTodo}/>
    </div>
  `
}

const completed = (store, actions) => {
  const routes = [
    {route: '/', name: 'HOME'},
    {route: '/todo', name: 'TODO'},
    {route: '/results', name: 'RESULTS'}
  ]

  return html`
    <div>
      <div class="center">
        <HeaderPage 
          title="Tram-One"
          subtitle="Completed Todo Page" />
        <NavRoutes routes=${routes} />
      </div>
      <hr />
      <Dones dones=${store.todos.dones}/>
    </div>
  `
}

const results = (store, actions) => {
  const completed = store.todos.dones.length
  const uncompleted = store.todos.todos.length

  const routes = [
    {route: '/', name: 'HOME'},
    {route: '/todo', name: 'TODO'},
    {route: '/completed', name: 'COMPLETED TODO'},
  ]
  
  return html`
    <div>
      <div class="center">
        <HeaderPage 
          title="Tram-One"
          subtitle="Results Page" />
        <NavRoutes routes=${routes} />
      </div>
      <h4>Uncompleted: ${uncompleted}</h4>
      <h4>Completed: ${completed}</h4>
      <h4>Total: ${completed + uncompleted}</h4>
    </div>
  `
}

app.addActions({todos: TodoActions})
app.addRoute('/', home)
app.addRoute('/todo', todo)
app.addRoute('/completed', completed)
app.addRoute('/results', results)

app.engine.addListener((store) => {
  localStorage.setItem('todos', JSON.stringify(store.todos))
})

app.start('.main')
