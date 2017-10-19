module.exports = {
  init: () => {
    let todos = localStorage.getItem('todos')
    todos = todos ? JSON.parse(todos) : {todos: [], dones: [], text: ''}
    return Object(todos)
  },
  addTodo: (state) => Object.assign({}, state, {
    todos: [state.text].concat(state.todos),
    text: ''
  }),
  completeTodo: (state, todoIndex) => Object.assign({}, state, {
    todos: state.todos.filter(
      (item, index) => index !== todoIndex
    ),
    dones: state.dones.concat(state.todos[todoIndex])
  }),
  updateInput: (state, newInput) => Object.assign({}, state, {
    text: newInput
  })
}
