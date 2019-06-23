## Tram-One as an NPM Dependency

If you're familiar with other view frameworks and build tools, you can use Tram-One in a similar way.

```bash
npm i tram-one
```

We recommend using [tram-one-express](/tram-one-express), however if you have your own build tooling,
using tram-one is as simple as including it as one of your dependencies.

### On Node.js

If you want to build pages using `Node.js` (on the server), you can do that too! Tram-One by default uses [domino](https://www.npmjs.com/package/domino) to build HTML components on the server, so you can build pages before serving them out.

> Note, if you decide to build pages on the server, they need to be _hydrated_ if you want them to interactive after the first render. Guides for this coming soon.

```javascript
const express = require('express')
const app = express()

const { registerHtml } = require('tram-one')
const html = registerHtml()

app.get('/', (req, res) => {
  const homePage = html`
    <html>
      <head>
        <title>Tram One</title>
      </head>
      <body>
        <h1>Tram-One</h1>
        <h2>This page was rendered on the server!</h2>
      </body>
    </html>
  `
  res.send(homePage.outerHTML)
})

app.listen(3000, () => console.log("Tram-One App Started"))
```
