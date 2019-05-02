// in reality, this should be either:
// const { ... } = require('tram-one')()
// or
// import Tram from 'tram-one'
// const { ... } = Tram()

const { registerHtml, useUrlParams, start } = window['tram-one']()

const html = registerHtml()

const home = () => {
  const { color } = useUrlParams()

  return html`
    <div>
      Tram-One
      uses <a href="https://github.com/chrisdavies/rlite">rlite</a>
      and <a href="https://github.com/JRJurman/url-listener">url-listener</a>
      to handle routing.
      <br/><br/>
      With rlite-router, Tram-One supports routes,
      path params, query-params, hash routes, and wildcards.
      <br/><br/>
      With url-listener, Tram-One supports can update on pushState, without doing a page reload.
      <br/><br/>

      How these tools are actually delivered are by a useUrlParams hook.
      <br/><br/>

      <div><a href="?color=blue">Go to Blue</a></div>
      <div><a href="?color=red">Go to Red</a></div>
      <div><a href="?color=green">Go to Green</a></div>

      <br/><br/>
      <div style="color:${color}">You've Selected ${color || 'no color'}</div>
      <br/>
    </div>
  `
}

start('.main', home)
