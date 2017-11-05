const Tram = require('../../../tram-one')

const html = Tram.html({
  Dones: require('../elements/Dones'),
  HeaderPage: require('../elements/HeaderPage')
})

module.exports = (store) => {
  return html`
    <div>
      <HeaderPage subtitle="Completed Todo Page" />
      <Dones dones=${store.todos.dones}/>
    </div>
  `
}
