const Tram = require('../../../tram-one')
const html = Tram.html()

const linkStyle = `
  cursor: pointer;
  color: blue;
  text-decoration: underline;
  padding: 0.2em;
`

module.exports = () => {
  const nav = (path) => () => {
    window.history.pushState(null, '', path)
  }

  return html`
    <div>
      <a style=${linkStyle} onclick=${nav('/')}>HOME</a>
      <a style=${linkStyle} onclick=${nav('/todo')}>TODO</a>
      <a style=${linkStyle} onclick=${nav('/completed')}>COMPLETED</a>
      <a style=${linkStyle} onclick=${nav('/results')}>RESULTS</a>
    </div>
  `
}
