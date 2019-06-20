const serverSpec = require('../../test-utilities/setup-server-spec')
const elementExists = require('../../test-utilities/element-exists')

module.exports = () => {
  return serverSpec('basic umd spec', __dirname, async (nightmare, host) => {
    const results = []
    // start electron instance and tests on the page
    await nightmare
      .goto(host)
      .exists('#umd-header')
      .then(headerExists => elementExists(headerExists, 'umd-header', results))

    return results
  })
}
