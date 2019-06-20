const serverSpec = require('../../test-utilities/setup-server-spec')
const elementExists = require('../../test-utilities/element-exists')

module.exports = () => {
  return serverSpec('svg component spec', __dirname, async (nightmare, host) => {
    const results = []

    // start electron instance and tests on the page
    await nightmare
      .goto(host)
      .exists('svg > rect[fill="yellow"]')
      .then(blockExists => elementExists(blockExists, 'svg block', results))

    return results
  })
}
