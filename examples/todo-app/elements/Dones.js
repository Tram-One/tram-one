const Tram = require('../../../index');

const Done = require('./Done');
const html = Tram.html({
  Done
});

module.exports = (attrs, children) => {

  const renderDone = (done) => {
    return html`
      <Done value=${done}></Done>
    `
  }

  const doneItems = attrs.dones.map(renderDone);

  return html`
    <div>
      ${doneItems}
    </div>
  `
}
