const serverSpec = require('../../test-utilities/setup-server')
const isTrue = require('../../test-utilities/is-true')

module.exports = () => {
  return serverSpec('side-effect spec', __dirname, async (nightmare, host) => {
    const results = []

    // start electron instance and tests on the page
    await nightmare
      .goto(host)
      .evaluate(() => window.mockLock)
      .then(mockLock => isTrue(mockLock, 'on start mock lock', true, results))

    await nightmare
      .goto(host)
      .click('#toggle-lock')
      .evaluate(() => window.mockLock)
      .then(mockLock => isTrue(mockLock, 'after clean up mock lock', false, results))

    await nightmare
      .goto(host)
      .click('#toggle-lock')
      .click('#toggle-lock')
      .evaluate(() => window.mockLock)
      .then(mockLock => isTrue(mockLock, 'after re-mount mock lock', true, results))

    return results
  })
}
