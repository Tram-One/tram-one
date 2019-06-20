const serverSpec = require('../../test-utilities/setup-server-spec')
const elementExists = require('../../test-utilities/element-exists')

serverSpec('use-global spec', __dirname, async (nightmare) => {
  // persist array of results
  const results = []

  // start electron instance and tests on the page
  await nightmare
    .goto('http://localhost:1228')
    .exists('.login-header[name="Sprocket"]')
    .then(countLinkExists => elementExists(countLinkExists, 'login header', results))

  await nightmare
    .goto('http://localhost:1228')
    .exists('.name-header[name="Sprocket"]')
    .then(countLinkExists => elementExists(countLinkExists, 'name header', results))


  return results
})
