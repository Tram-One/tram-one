## Modern View Framework For Pure Javascript

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
