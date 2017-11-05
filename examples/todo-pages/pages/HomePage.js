const Tram = require('../../../tram-one')

const html = Tram.html({
  HeaderPage: require('../elements/HeaderPage')
})

module.exports = () => {
  return html`
    <HeaderPage subtitle="Home Page" />
  `
}
