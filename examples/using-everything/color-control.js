const Tram = require('../../index')

const html = Tram.html()

const buttonStyle = color => `
  border: none;
  background: ${color};
  color: white;
  border-radius: 2em;
  padding: 1em 2em;
  margin: 1em;
  cursor: pointer;
  font-size: .75em;
`

module.exports = (attrs, children) => {
  const colors = ['black', 'blue', 'red'].map(color => html`
    <button onclick=${attrs.onSelectColor.bind(this, color)}
            style=${buttonStyle(color)}>
      ${color}
    </button>
  `)
  return html`
    <div>
      ${colors}
    </div>
  `
}
