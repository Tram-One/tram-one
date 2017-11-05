const Tram = require('../../../tram-one')

const html = Tram.html({
  Todo: require('./Todo')
})

module.exports = (attrs, children) => {
  const renderTodo = (todo, index) => {
    return html`
      <Todo index=${index} value=${todo}
        onComplete=${attrs.onCompleteTodo(index)}/>
    `
  }

  const todoItems = attrs.todos.map(renderTodo)

  return html`
    <div>
      ${todoItems}
    </div>
  `
}
