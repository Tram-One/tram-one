const Tram = require('../../../tram-one')

const Todo = require('./Todo')
const html = Tram.html({
  Todo
})

module.exports = (attrs, children) => {
  const renderTodo = (todo, index) => {
    return html`
      <Todo index=${index} value=${todo}
        onComplete=${attrs.onCompleteTodo(index)}>
      </Todo>
    `
  }

  const todoItems = attrs.todos.map(renderTodo)

  return html`
    <div>
      ${todoItems}
    </div>
  `
}
