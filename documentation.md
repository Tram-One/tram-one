# Tram-One

Modern View Framework for Vanilla Javascript

[Introduction](#introduction)
[Features](#features)
[Install](#install)
[Concepts](#concepts)
[API](#api)
[Discord](https://discord.gg/dpBXAQC)
[Github](https://github.com/Tram-One)
[NPM](https://www.npmjs.com/package/tram-one)

## Introduction

Tram-One is a Modern View Framework that has advance features like hooks, observables, and JSX-like template components, all in plain vanilla javascript.

Tram-One takes inspiration from frameworks like [Choo](https://choo.io/), [React](https://reactjs.org/), and [Svelte](https://svelte.dev/), and provides a rich feature set without additional libraries.

This site is a one-stop-shop with everything you need to know about Tram-One. If you have any questions from this page or about Tram-One, or just want to say hi, [join our Discord](https://discord.gg/dpBXAQC)!

```js
import {registerHtml, start} from 'tram-one'

const html = registerHtml()
const home = () => {
  return html`
    <main>
      <h1> Tram-One </h1>
      <h2>
        A Modern View Framework
        For Vanilla Javascript
      </h2>
    </main>
  `
}

start(home, '#app')
```


## Features

Tram-One offers JSX-like view components with ES6 Template Strings, which are [supported in all modern browsers](https://caniuse.com/template-literals).

Anyone familiar with React should feel right at home building and composing components and pages.

```js
const html = registerHtml({
  'TramHeader': TramHeader
})

const page = (attrs) => {
  const { color } = attrs
  return html`
    <TramHeader color=${color}>
      Tram-One Rules!
    </TramHeader>
  `
}
```

Tram-One includes a set of default hooks, similar to React and Svelte, which allow for routing, effects, component state, and global state management.

Tram-One's hooks are intelligent, and update components only when required, making apps more performant!

```js
const html = registerHtml()

const page = () => {
  const counter = useStore({count: 0})
  const incrementCount = () => {counter.count++}
  return html`
    <button onclick=${incrementCount}>
      ${count}
    </button>
  `
}
```

With only a handful of functions, Tram-One's API is small and easy to learn, while being complete enough to make rich web experiences.

The API covers everything you need to build basic web-applications, and provide the building blocks for more complex ones.

```js
import { registerHtml, useGlobalStore, useUrlParams, start } from 'tram-one'

const html = registerHtml()
const app = () => {
  if (useUrlParams('/error').matches) return html`<p>Oh no!</p>`

  const { user } = useUrlParams('/:user')
  const userObject = useGlobalStore('USER_NAME', {username: ''})
  const updateUserName = (event) => { userObject.username = event.target.value }

  return html`
    <main>
      <h1> Hello ${userObject.username} </h1>
      <input value=${userObject.username} onchange=${updateUserName} />
    </main>
  `
}

start(app, '#app')
```

## Install

There are multiple ways to get started with Tram-One!

### Tram-One Express

The fastest and easiest way to get started wtih Tram-One is by using Tram-One Express, a dedicated generator for building single-page apps using Tram-One.

It comes with example code, build tooling (via [parcel](https://parceljs.org/)), and tests to help you get started!

You can check out the documentation here:
[https://github.com/Tram-One/tram-one-express](https://github.com/Tram-One/tram-one-express)

```sh
npx tram-one-express app-name
```

### NPM

You can install Tram-One by itself via npm. This is valuable if you have your own project tooling or are working in a cloud workspace. To see other npm details, checkout out the page on npm: [https://www.npmjs.com/package/tram-one](https://www.npmjs.com/package/tram-one)

```sh
npm install --save tram-one
```

### Script Tag

You can include Tram-One in an html page by adding a script tag pointing to the umd module on the npm content delivery network [unpkg](https://unpkg.com/).
[https://unpkg.com/tram-one/dist/tram-one.umd.js](https://unpkg.com/tram-one/dist/tram-one.umd.js)

This is nice because it does not require a build system, and allows you to quickly see Tram-One running in your browser. However to build larger applications, it's recommended that you use one of the above solutions.

```html
<html>
  <head>
    <script src="https://unpkg.com/tram-one@10/dist/tram-one.umd.js"></script>
  </head>
  <body>
    <div class="app"></div>
    <script>
      const { registerHtml, start } = window['tram-one']
			const html = registerHtml()

			const home = () => {
				return html`
					<h1>Tram-One Rules</h1>
				`
			}

			start(home, '.app')

    </script>
  </body>
</html>
```

## Concepts

Tram-One shares many concepts with other web frameworks like React, Choo, and Svelte. If you aren't familiar with them, here are the important concepts you will encounter when building web applications.

### Components

Components are the main visual components you'll work with to build applications. They are inspired heavily by [React's](https://reactjs.org/) JSX and [Choo](https://choo.io/).

Components are always functions, and they should always return some DOM generated by the HTML template tag function.

```js
const html = registerHtml()
const MyHeader = () => {
  return html`
    <h1>Tram-One Rules</h1>
  `
}
```

Components can be included in other custom components when passed into registerHtml.

When imported, the key dictates what the tag name will be. This can be camel case, hyphenated, or just a lowercase string!

While still native Javascript, you can build complex and nested components just like you might with React's JSX.

```js
const html = registerHtml({
  'MyHeader': MyHeader
})

const MyPage = () => {
  return html`
    <main>
      <MyHeader />
      <p>Welcome to my page</p>
    </main>
  `
}
```

Components can have attributes and children. Both are optional parameters that are written just like normal HTML in the template, and come in as parameters in the component.

Attributes can match the standard html spec (e.g. id, class, onclick), or be custom variables.

Children are just nodes inside the component, and shouldn't be manipulated directly, but can be wrapped with other DOM.

```js
const html = registerHtml()

const ColorizedHeader = (attrs, children) => {
  const {className, color} = attrs
  return html`
    <h1
      class=${className}
      style="color=${color};">
      ${children}
    </h1>
  `
}
```

Attributes and children are written just like normal HTML. There are no special directives or properties. Tram-One's HTML Templates mimic standard HTML.

```js
const html = registerHtml({
  'colorized-header': ColorizedHeader
})

const Page = () => {
  return html`
    <colorized-header class="page-header" color="red">
      Standard & Custom Attributes!
    </colorized-header>
  `
}
```

### Observables

Observables are how Tram-One keeps track of state. They are inspired heavily by the [Svelte](https://svelte.dev/) framework.

When you update an observable, only the components (and effects) that are dependent on that state are updated.

```js
const page = () => {
  const username = useGlobalStore('username')
  const votes = useStore({count: 0})
  const increment = () => setVotes(votes.count++)
  return html`
    <section>
      ${username.name} has ${votes} votes.
    </section>
  `
}
```

Observables can be tapped into by using the useStore and useGlobalStore hooks.

```js
const page = () => {
  const username = useGlobalStore('username', {name: 'Unassigned'})
  const onSetName = (event) => {username.name = event.target.value}
  return html`
    <section>
      Username: <input onchange=${onSetName} value=${username.name} />
    </section>
  `
}
```

Global observables allow you to use a key to access the same data regardless of where you are in the app.

This can make sharing data across an entire project much easier, and fulfills the role of React's Context API.

```js
const page = () => {
  const counter = useStore({ count: 0 })
  const increment = () => { counter.count += 1 }
  return html`
    <button onclick=${increment}>${counter.count}</button>
  `
}
```

### Effects

Effects are functions that run after elements have been added, updated, or removed. They are inspired by [React's](https://reactjs.org/) useEffect hook.

Effects are defined using the useEffect hook. They take in a single dependency, the effect to trigger.

```js
const home = () => {
  useEffect(() => {
    console.log('App Mounted')
  })
  return html`<h1>Tram-One</h1>`
}
```

If the effect is dependent on a observable object, it will automatically trigger again when that dependent property updates.

```js
const counter = () => {
  const countObject = useStore({ value: 0 })
  useEffect(() => {
    console.log(`Current count: ${countObject.value}`)
  })
  const incrementCount = () => countObject.value++
  return html`
    <button onclick=${incrementCount}>
      Increment Count
    </button>
  `
}
```

If the effect returns a function, that function will be called when the component is updated or removed.

If the effect does not return a function, the return is ignored, which means you can make the entire effect an async function and the returned promise will be ignored.

```js
const counter = () => {
  useEffect(() => {
    const cleanup = () => console.log('component removed/updated')
    return cleanup
  })
  return html`
    <section>
    </section>
  `
}
```

## API

Tram-One has a simple interface to help you build your web app.

### start

```
start(component: TramOneComponent, target: selector | HTMLElement): void
```

Function to attach a component to an existing element on the page. This function also starts all the listeners and allows the basic hooks to function.

This should only be called for the initial render / building of the app.

```js
import { start, registerHtml } from 'tram-one'

const html = registerHtml()

const home = () => html`
  <h1>Tram-One</h1>
`

start(home, '#app')
```

You can call this with a CSS selector, or directly on a HTML Element.

```js
import { start, registerHtml } from 'tram-one'

const html = registerHtml()

const home = () => html`
  <h1>Tram-One</h1>
`

const testContainer = document.createElement('main')
start(home, testContainer)
```

### registerHtml

```
registerHtml(registry?: {[tag: string]: TramOneComponent}): DOMTaggedTemplateFunction
```

Function to generate a tagged template function for XHTML / HTML. If you have no custom components, you can call this with no parameters.

```js
import { start, registerHtml } from 'tram-one'

const html = registerHtml()

const home = () => {
    return html`<h1>Tram-One</h1>`
  }
}
```

To import a custom component, include it in the registerHtml with the tag name you want to use as the key. These keys can be hyphenated, camelcase, or whatever!

```js
import { registerHtml } from 'tram-one'
import customHeader from './custom-header'

const html = registerHtml({
  'custom-header': customHeader
})

const home = () => html`
  <custom-header />
`
```

### registerSvg

```
registerSvg(registry?: {[tag: string]: TramOneComponent}): DOMTaggedTemplateFunction
```

Function to generate a tagged template function for SVG. This acts identical to registerHtml, but uses DOM methods for building svg graphics.

```js
import { registerSvg } from 'tram-one'

const svg = registerSvg()

const home = () => svg`
  <svg>
    <g>
      <circle fill="#ce1271" cx="100" cy="100" r="20"/>
    </g>
  </svg>
`
```

### useStore

```
useStore<Store extends any[] | Object}>(defaultValue: Store): Store
```

Hook that stores local component state. The function takes in a default value and returns the current value.

Rather than returning a setter, the values in useStore must always be an Object or Array, and apps should mutate the subfields the Object, or items in the Array, directly.

When a subfield or item is updated, then only the components that are dependent on that field will update.

```js
import { registerHtml, useStore } from 'tram-one'
const html = registerHtml()

const page = () => {
  const counter = useStore({ count: 0 })
  const increment = () => { counter.count += 1 }
  return html`
    <button onclick=${increment}>${counter.count}</button>
  `
}
```

### useGlobalStore

```
useGlobalStore<Store extends any[] | Object}>(key: string, defaultValue: Store): Store
```

Hook that stores global state and makes it accessible in the component and across the app.

This in part fills the role of React's Context API, but acts just like the useStore hook.

useGlobalStore takes in a key and an optional default value. The key can be any string, and is used to access the value anywhere else in the app. The default value is optional and can be filled in by another call to useGlobalStore in the app.

```js
import { registerHtml, useStore } from 'tram-one'
const html = registerHtml()

const page = () => {
  const counter = useGlobalStore({ count: 0 })
  const increment = () => { counter.count += 1 }
  return html`
    <button onclick=${increment}>${counter.count}</button>
  `
}
```

### useEffect

```
useEffect(effect: Effect): void
```

Hook that triggers component start, update, and cleanup effects.

The hook takes in an effect to run when the component is mounted. If any stores are used in the hook, when that data updates, it will trigger the effect again.

If the return of effect is another function, then that function is called when the component is updated or removed.

```js
import { registerHtml, useEffect } from 'tram-one'

const html = registerHtml()

const home = () => {
  useEffect(() => {
    console.log('App Mounted')
  })
  return html`<h1>Tram-One</h1>`
}
```

### useUrlParams

```
useUrlParams(pattern?: string): UrlMatchResults
```

Hook that returns path variables based on the route. Can return path parameters, query params, and more!

You can test for a path by calling useUrlParams with the paths you expect to see. The hook will return an object with a matches key that will be true or false, depending on if the patch matches.

```js
import { start, registerHtml, useUrlParams } from 'tram-one'

const url = window.location.hostname
const html = registerHtml()

const home = () => {
  if (useUrlParams('/home').matches) return html`<h1>Home Page</h1>`
  if (useUrlParams('/details').matches) return html`<h1>Details Page</h1>`
  return html`<h1>No Page</h1>`
}
```

If you want to pull variables from the path, then use the /:var/ pattern in the path you pass in. You can also pull query parameters from the path as well.

It's internal functionality is powered by the package [rlite](https://www.npmjs.com/package/rlite-router).

```js
import { start, registerHtml, useUrlParams } from 'tram-one'

const url = window.location.hostname
const html = registerHtml()

const home = () => {
  const { size } = useUrlParams('/:size')
  const pageStyle = `font-size: ${size}em;`
  return html`
  <main style=${pageStyle}>
    <h1>Tram-One hooks are neat!</h1>
  </main>
}
```
