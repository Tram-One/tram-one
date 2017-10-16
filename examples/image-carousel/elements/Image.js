const Tram = require('../../../tram-one')

const html = Tram.html()

const divStyle = `
  width : 100%;
`

const imgStyle = `
  width : 100%;
  margin : auto;
  display : block;
`

const textCenter = `
  text-align : center;
`

const textLeft = `
  float : left;
  cursor : pointer;
  user-select : none;
`

const textRight = `
  float : right;
  cursor : pointer;
  user-select : none;
`

module.exports = (attrs, children) => {

  return html`
    <div style=${divStyle}>   
        <img style=${imgStyle} src=${attrs.tile.image} alt=${attrs.tile.alt}/>
        <h3 style=${textCenter}>${attrs.tile.text}</h3>
      <h3>
        <span onclick=${attrs.onPreviousSelect(attrs.size)} style=${textLeft}>Previous</span>
        <span onclick=${attrs.onNextImage(attrs.size)} style=${textRight}>Next</span>
      </h3>
    </div>
  `
}
