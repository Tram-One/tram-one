const Tram = require('../../../tram-one')

const html = Tram.html({
  NavRoutes: require('./NavRoutes')
})

const headerStyle = `
  text-align: center;
`

module.exports = ({title, subtitle = undefined}, children) => {
  const contentSubtitle = subtitle ? html`<h2> ${subtitle} </h2>` : null
  return html`
    <div style=${headerStyle}>
      <h1> Tram-One 🚋 </h1>
      ${contentSubtitle}
      <NavRoutes />
      <hr />
    </div>
  `
}
