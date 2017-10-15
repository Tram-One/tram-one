const Tram = require('../../../tram-one')

const ImageTile = require('./ImageTile')
const html = Tram.html({
  ImageTile
})


const divStyle = `
  width : 100%;
  border : 2px black solid;
  overflow : scroll;
  display : flex;
`

module.exports = (attrs, children) => {
  const renderImageTile = (value,index) => {
    return html`
      <ImageTile value=${value} index=${index} onSelect=${attrs.onSelect(index)}></ImageTile>
    `
  }

  const imageTiles = attrs.images.map(renderImageTile)

  return html`
    <div style=${divStyle}>
      ${imageTiles}
    </div>
  `
}
