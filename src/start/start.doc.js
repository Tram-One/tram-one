/* eslint valid-jsdoc: 2 */

/**
 * @name start
 * @function
 * @memberof Tram-One
 * @instance
 *
 * @description
 * Function to attach a {@link component} to an existing element on the page.
 * This function also starts all the listeners and allows the basic hooks to function.
 *
 *
 * This should only be called for the initial render / building of the app.
 *
 * @param {string|Node} selector either a CSS selector, or Node to attach the component to
 *
 * @param {component} component top-level component to attach to the page.
 *
 *
 * @example
 * import { registerHtml, start } from 'tram-one';
 * import './styles.css';
 *
 * const html = registerHtml();
 *
 * const home = () => html`
 *   <div>
 *     <h1>Tram-One Rocks!</h1>
 *   </div>
 * `;
 *
 * start('#app', home);
 */
