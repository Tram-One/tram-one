const serverSpec = require('../../test-utilities/setup-server-spec')
const elementExists = require('../../test-utilities/element-exists')

module.exports = () => {
  return serverSpec('svg component spec', __dirname, async (nightmare) => {
    const results = []

    // start electron instance and tests on the page
    await nightmare
      .goto('http://localhost:1228')
      .exists('svg > rect[fill="yellow"]')
      .then(blockExists => elementExists(blockExists, 'svg block', results))

    return results
  })
}
