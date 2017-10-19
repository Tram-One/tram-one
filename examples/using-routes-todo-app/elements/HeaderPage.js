const Tram = require('../../../tram-one')

const html = Tram.html()

module.exports = ({title, subtitle = undefined}, children) => {
    const contentSubtitle = subtitle ? html`<h2> ${subtitle} </h2>` : null
  return html`
    <div>
      <h1> ${title} 🚋 </h1>
      ${contentSubtitle}
    </div>
  `
}
