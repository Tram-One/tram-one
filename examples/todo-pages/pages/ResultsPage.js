const Tram = require('../../../tram-one')

const html = Tram.html({
  HeaderPage: require('../elements/HeaderPage')
})

module.exports = (store) => {
  const completed = store.todos.dones.length
  const uncompleted = store.todos.todos.length

  return html`
    <div>
      <HeaderPage subtitle="Results Page" />
      <h4>Uncompleted: ${uncompleted}</h4>
      <h4>Completed: ${completed}</h4>
      <h4>Total: ${completed + uncompleted}</h4>
    </div>
  `
}
