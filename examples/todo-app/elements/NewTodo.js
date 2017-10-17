const Tram = require('../../../tram-one')

const html = Tram.html()

module.exports = (attrs, children) => {
  const submitTodo = (event) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
      attrs.onAddTodo()
      event.currentTarget.focus()
    }
  }

  return html`
    <div>
      <input  onkeyup=${submitTodo}
              onchange=${attrs.onUpdateInput}
              value=${attrs.value}/>
      <button onclick=${attrs.onAddTodo}>
        Add Todo
      </button>
    </div>
  `
}
