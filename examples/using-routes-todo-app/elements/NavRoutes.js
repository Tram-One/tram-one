const Tram = require('../../../tram-one')
const html = Tram.html()

module.exports = ({routes}, children) => {
  const renderRoutes = ({route, name}) => {
    return html`
      <a class="m-r" href="${route}">${name}</a>
    `
  }

  const routesItems = routes.map(renderRoutes)

  return html`
    <div>
      ${routesItems}
    </div>
  `
}
