// in reality, this should be either:
// const { ... } = require('tram-one')()
// or
// import Tram from 'tram-one'
// const { ... } = Tram()

const { start, registerHtml, useStore, addActions, addListener } = window['tram-one']()

// real code you would see in a project

const html = registerHtml()

const countActions = {
  init: () => 0,
  incrementCount: (count) => count + 1
}

const clicker = () => {
  const [store, actions] = useStore()
  return html`
    <div>
      Tram-One
      uses <a href="https://github.com/JRJurman/hover-engine">Hover-Engine</a> to handle redux-like state management,
      and <a href="https://github.com/Tram-One/tatermorph">tatermorph</a> (a fork of nanomorph) for DOM diffing.
      <br />
      <button onclick=${actions.incrementCount}>
        This button has been clicked ${store.counter} times!
      </button>
    </div>
  `
}

addActions({ counter: countActions })

// if you take a look at the console, we can add a listener that logs on action
console.log(
  'We added a listener so that you can trigger side-effects on different actions resolving'
)
addListener((store) => {
  console.log(store)
})

start('.main', clicker)
