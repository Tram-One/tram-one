const Tram = require('../../../tram-one')
const html = Tram.html()

const imgStyle = `
  width : 100%;
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
    <div>
      <img style=${imgStyle} src=${attrs.tile}/>
      <h3>
        <span onclick=${attrs.onPreviousSelect(attrs.size)} style=${textLeft}>Previous</span>
        <span onclick=${attrs.onNextImage(attrs.size)} style=${textRight}>Next</span>
      </h3>
    </div>
  `
}
