<p align="center"><a href="http://tram-one.io/"><img src="https://raw.githubusercontent.com/Tram-One/tram-logo/master/v3/tram.svg?sanitize=true" height="256"></a></p>

<div align="center">
  <a href="https://www.npmjs.com/package/tram-one">
    <img src="https://img.shields.io/npm/dm/tram-one.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/tram-one">
    <img src="https://img.shields.io/npm/v/tram-one.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/tram-one">
    <img src="https://img.shields.io/npm/l/tram-one.svg" alt="License">
  </a>
</div>
<div align="center">
  <a href="https://www.npmjs.com/package/tram-one">
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/badges/cjs.svg?sanitize=true" alt="Common JS build size">
  </a>
  <a href="https://unpkg.com/tram-one/dist/tram-one.umd.js">
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/badges/umd.svg?sanitize=true" alt="UMD build size">
  </a>
  <a href="https://join.slack.com/t/tram-one/shared_invite/enQtMjY0NDA3OTg2MzQyLWUyMGIyZTYwNzZkNDJiNWNmNzdiOTMzYjg0YzMzZTkzZDE4MTlmN2Q2YjE0NDIwMGI3ODEzYzQ4ODdlMzQ2ODM">
    <img src="https://img.shields.io/badge/slack-join-83ded3.svg?style=flat" alt="Join Slack">
  </a>
</div>

# Tram-One

**Modern View Framework For Pure Javascript**


Tram-One is a light View Framework that comes with all the dependencies you need to start developing on the web.


Tram-One is an orchestration of common features, and relies only on plain pure javascript, so you don't have to bother learning / parsing / transpiling special templating languages. It relies only on ES6 Template Strings, which are [supported in most major browsers](https://caniuse.com/#feat=template-literals).

```javascript
import { registerHtml, start } from 'tram-one'
const html = registerHtml()

const home = () => {
  return html`
    <div>
      <h1>Tram One</h1>
      <h2>A Modern View Framework</h2>
    </div>
  `
}

start('#app', home)
```

Tram-One takes inspiration from frameworks like [Choo](https://choo.io/) and [React](https://reactjs.org/). Tram-One includes a set of default hooks, similar to React, which allow for
routing, component state, and global state management.

```javascript
import { registerHtml, useState } from 'tram-one'
const html = registerHtml()

export default () => {
  const [count, updateCount] = useState(0)
  const incrementCount = () => updateCount(count + 1)
  return html`
    <button
      class="counter-button"
      onclick=${incrementCount}
    >
      ${count}
    </button>
  `
}
```

The syntax is based on similar modules that Choo uses, offering custom components in a
js template syntax that should be familiar and confortable to React developers.

```javascript
import { registerHtml, useState } from 'tram-one'
import Counter from './Counter'
const html = registerHtml({
  'Counter': Counter,
})

export default () => {
  return html`
    <div>
      <span>Click the button below to update your count</span>
      <Counter />
    </div>
  `
}
```
