const serverSpec = require('../../test-utilities/setup-server-spec')
const elementExists = require('../../test-utilities/element-exists')

serverSpec('custom component spec', __dirname, async (nightmare) => {
  // persist array of results
  const results = []

  // start electron instance and tests on the page
  await nightmare
    .goto('http://localhost:1228')
    .exists('.custom-header')
    .then(headerExists => elementExists(headerExists, 'custom header', results))

  return results
})
