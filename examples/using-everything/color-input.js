const Tram = require('../../tram-one')

const html = Tram.html()

const inputStyle = 'font-size: inherit'
module.exports = (attrs, children) => {
  const triggerEvent = (event) => {
    if (event.key === 'Enter') {
      attrs.onEnterColor(event.currentTarget.value)
    }
  }
  return html`
    <div>
      Path:
      <input  onkeyup=${triggerEvent}
              style=${inputStyle}
              value=${window.location.pathname} />
    </div>
  `
}
