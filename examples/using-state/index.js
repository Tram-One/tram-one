// in reality, this should be either:
// const { ... } = require('tram-one')
// or
// import { ... } from 'tram-one'

const { start, registerHtml, useState } = window['tram-one']

// real code you would see in a project

const html = registerHtml()

const useCounter = () => {
  const [counter, setCounter] = useState(0)
  const incrementCounter = () => {
    setCounter(counter + 1)
  }

  const decrementCounter = () => {
    setCounter(counter - 1)
  }

  return { counter, incrementCounter, decrementCounter }
}

const clicker = () => {
  const { counter, incrementCounter, decrementCounter } = useCounter()
  return html`
    <div>
      Tram-One uses <a href="https://github.com/JRJurman/hover-engine">Hover-Engine</a> internally to manage state, but you can use standard hooks to update and read values.
      Tram-One also uses <a href="https://github.com/Tram-One/tatermorph">tatermorph</a> (a fork of nanomorph) for DOM diffing.
      <br />
      <div>Counter = ${counter}</div>
      <button onclick=${incrementCounter}>
        Up
      </button>
      <button onclick=${decrementCounter}>
        Down
      </button>
    </div>
  `
}

start('.main', clicker)
