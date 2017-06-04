const Tram = require('../../index');
const html = Tram.html({});

module.exports = (attrs, children) => {
  return html(`
    <div>
      <h1>Tram-1 🚋</h1>
      ${children}
      <div> Footer </div>
    </div>
  `);
}
