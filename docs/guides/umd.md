# Installation using a Script Tag

> This setup does not require any installed programs, and can work on any machine that has access to a browser.

If you would like to use Tram-One without having to install or build a javascript project
then you can include the following in any html page:

```html
<script src="https://unpkg.com/tram-one/dist/tram-one.umd.js"></script>
```

This script tag will include a `tram-one` object on the window that you can use to get
any of the standard methods.

```html
<body>
  <div class="main"></div>
  <script>
    const { registerHtml, start } = window['tram-one']
    const html = registerHtml()

    const page = () => {
      return html`
        <div>
          <h1>Tram-One</h1>
          Learn more at <a href="tram-one.io">tram-one.io</a>
        </div>
      `
    }

    start('.main', page)
  </script>
</body>
```
