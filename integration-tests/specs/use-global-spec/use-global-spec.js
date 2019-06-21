const serverSpec = require('../../test-utilities/setup-server')
const elementExists = require('../../test-utilities/element-exists')

module.exports = () => {
  return serverSpec('use-global spec', __dirname, async (nightmare, host) => {
    const results = []

    // start electron instance and tests on the page
    await nightmare
      .goto(host)
      .exists('.login-header[name="Sprocket"]')
      .then(countLinkExists => elementExists(countLinkExists, 'login header', results))

    await nightmare
      .goto(host)
      .exists('.name-header[name="Sprocket"]')
      .then(countLinkExists => elementExists(countLinkExists, 'name header', results))

    return results
  })
}
