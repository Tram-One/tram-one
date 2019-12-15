const useUrlParams = require('use-url-params')

/**
 * @name useUrlParams
 * @description
 * Hook that returns path variables based on the route.
 * Can return path parameters, query params, and more.
 * It's internal functionality is powered by the package
 * {@link https://www.npmjs.com/package/rlite-router | rlite}
 *
 * @param {String} [pattern] path to match on (can include path variables)
 *
 * @returns {Object|Boolean} object with params if path matches, otherwise returns false
 *
 * @example
 * // Check Route Example
 * import { registerHtml, useUrlParams } from 'tram-one'
 * import HomePage from './pages/home'
 * import UserPage from './pages/user'
 * import NotFoundPage from './pages/not-found'
 *
 *
 * export default () => {
 *   if (useUrlParams('/')) return HomePage();
 *   if (useUrlParams('/user')) return UserPage();
 *   return NotFoundPage();
 * }
 *
 * @example
 * // Get Url Params - path is `/user/exampleUser?session=true`
 * import { registerHtml, useUrlParams } from 'tram-one'
 *
 *
 * export default () => {
 *   const params = useUrlParams('/user/:userId')
 *   params.userId // => exampleUser
 *   params.session // => true
 * }
 */
module.exports = pattern => useUrlParams(pattern)
