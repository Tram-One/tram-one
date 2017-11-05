const Tram = require('../../../tram-one')

const html = Tram.html()

const imgStyle = `
  height : 150px;
`
const divStyle = `
  padding-right: 200px;
  cursor: pointer;
  overflow: hidden;
  margin: 20px;
`

module.exports = (attrs, children) => {
  return html`
    <div style=${divStyle}>
      <img style=${imgStyle} src=${attrs.value} onclick=${attrs.onSelect}/>
    </div>
  `
}
