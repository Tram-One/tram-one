const Tram = require('../../../tram-one')

const html = Tram.html()

const divStyle = `
  width : 100%;
`

const imgStyle = `
  width : 100%;
  height : 400px;
  margin : auto;
  display : block;
`

const textCenter = `
  text-align : center;
`

const textLeft = `
  float : left;
  padding : 5px 7px;
  background-color : black;
  color : white;
  cursor : pointer;
  margin-bottom : 10px;
`

const textRight = `
  float : right;
  padding : 5px 7px;
  background-color : black;
  color : white;
  cursor : pointer;
  margin-bottom ; 10px;
`

module.exports = (attrs, children) => {

  const img = attrs.tiles[attrs.selected];

  return html`
    <div style=${divStyle}>   
        <img style=${imgStyle} src=${img.image} alt=${img.alt}/>
        <h3 style=${textCenter}>${img.text}</h3>
      <h3>
        <span onclick=${attrs.onPreviousSelect} style=${textLeft}>Previous</span>
        <span onclick=${attrs.onNextImage} style=${textRight}>Next</span>
      </h3>
    </div>
  `
}
