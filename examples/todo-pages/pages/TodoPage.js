const Tram = require('../../../tram-one')

const html = Tram.html({
  HeaderPage: require('../elements/HeaderPage'),
  NewTodo: require('../elements/NewTodo'),
  Todos: require('../elements/Todos')
})

module.exports = (store, actions) => {
  const onUpdateInput = ({currentTarget: {value}}) => {
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
      <HeaderPage subtitle="Todo Page" />
      <NewTodo  value=${store.todos.text}
                onUpdateInput=${onUpdateInput}
                onAddTodo=${onAddTodo}/>
      <Todos todos=${store.todos.todos}
             onCompleteTodo=${onCompleteTodo}/>
    </div>
  `
}
