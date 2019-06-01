/* eslint valid-jsdoc: 2 */

/**
 * @name useUrlParams
 * @function
 * @memberof Tram-One
 * @instance
 *
 * @description
 * Hook that returns path variables based on the route.
 * Can return path parameters, query params, and more.
 * It's internal functionality is powered by the package
 * {@link https://www.npmjs.com/package/rlite-router | rlite}
 *
 * @param {String} [pattern] path for resolving path parameters (not required for query params)
 *
 * @returns {Object|Boolean} object with params if path matches, otherwise returns false
 *
 * @example <caption>Check Route Example</caption>
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
 * @example <caption>Get Url Params - path is `/user/exampleUser?session=true`</caption>
 * import { registerHtml, useUrlParams } from 'tram-one'
 *
 *
 * export default () => {
 *   const params = useUrlParams('/user/:userId')
 *   params.userId // => exampleUser
 *   params.session // => true
 * }
 */
