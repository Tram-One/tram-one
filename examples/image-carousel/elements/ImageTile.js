const Tram = require('../../../tram-one')

const html = Tram.html()

const imgStyle = `
  width : 200px;
  height : 150px;
  margin : auto;
  display : block;
`
const divStyle = `
  padding : 20px;
  display: flex;
  cursor : pointer;
`

module.exports = (attrs, children) => {
  return html`
    <div style=${divStyle}>
      <abbr title=${attrs.value.alt}><img style=${imgStyle} src=${attrs.value.image} alt=${attrs.value.alt} onclick=${attrs.onSelect}/></abbr>
    </div>
  `
}
