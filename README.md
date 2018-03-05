<p align="center"><a href="http://tram-one.io/" target="_blank"><img src="https://raw.githubusercontent.com/Tram-One/tram-logo/master/v3/tram.svg?sanitize=true" height="128"></a></p>

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
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/images/esm.svg?sanitize=true" alt="ESM build size">
  </a>
  <a href="https://unpkg.com/tram-one/dist/tram-one.umd.js">
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/images/umd.svg?sanitize=true" alt="UMD build size">
  </a>
  <a href="https://join.slack.com/t/tram-one/shared_invite/enQtMjY0NDA3OTg2MzQyLWUyMGIyZTYwNzZkNDJiNWNmNzdiOTMzYjg0YzMzZTkzZDE4MTlmN2Q2YjE0NDIwMGI3ODEzYzQ4ODdlMzQ2ODM">
    <img src="https://img.shields.io/badge/slack-join-83ded3.svg?style=flat" alt="Join Slack">
  </a>
</div>

# Tram-One

Batteries Included View Framework
<br>
<br>

## Install

You can include Tram One as a Node Dependency:
```sh
npm install tram-one --save
```

Or, you can use the Universal Module Definition (UMD) in a script tag:

```html
<head>
  <script src="https://unpkg.com/tram-one/dist/tram-one.umd.js"></script>
</head>
```

## Summary
Tram-One is a view framework for developers who want to jump straight into
building on the web. At its core, Tram-One is a collection of a few packages
that gives you the tools to start working right away. That is to say...
Batteries Included!

### Why?
Tram-One is a project built to make exposing custom elements easy, and to
have redux-like state management, and basic routing by default. It was created
out of  the frustration of having to scaffold the same dependencies over and
over again.

Tram-One was also created to avoid a lot of the syntax that locks you into
frameworks like Vue and React. The components written here can mimic the syntax
you're already familiar, or help you create pure HTML friendly code.

### Some Assembly Required
While Tram-One comes with several packages to help you on your way, it does
not include a way to bundle and run your code. The obvious answers are
[webpack](https://www.npmjs.com/package/webpack),
[browserify](https://www.npmjs.com/package/browserify),
[budo](https://www.npmjs.com/package/budo), etc...

If you want to quickly get started though, use
[tram-one express](https://www.npmjs.com/package/tram-one-express)!

```
$ npm install -g tram-one-express
$ tram-one-express app-name
```

Tram-One Express builds a local project with everything you need to get started
developing! It includes all the dependencies and some example code to help you
get familiar with Tram-One.

## Packages
Tram-One is a collection of excellent packages (and
[some](https://github.com/Tram-One/hyperx) [forks](https://github.com/Tram-One/belit)).<br>
Here are the different package that make Tram-One possible...

For Rendering:
  - [hyperx](https://github.com/Tram-One/hyperx)
  - [belit](https://github.com/Tram-One/belit)
  - [rbel](https://github.com/aaaristo/rbel)
  - [nanomorph](https://github.com/choojs/nanomorph)

For Routing:
  - [rlite](https://github.com/chrisdavies/rlite)
  - [url-listener](https://github.com/Tram-One/url-listener)

For State Management:
  - [hover-engine](https://github.com/Tram-One/hover-engine)

While not used in this project, Tram-One is heavily inspired by the
[choo](https://github.com/choojs/choo) view framework.
Special thanks go out to the people on that project, and its
creator, [Yoshua Wuyts](https://github.com/yoshuawuyts).
If you like some of the things here, definitely
[go check out that project](https://github.com/choojs).

## Video Tutorial
This video tutorial goes through the process of build a Tram-One web app
from start to finish.

While it does not go into depth on all the things you can do with Tram-One,
it's a great introduction to help you get started building a Tram-One app.

Link: https://youtu.be/mgHJbqls-wk

## Examples

### Annotated Examples
<details>
<summary>
Here is a tiny example, the bare-minimum for
creating an app.
</summary>

```js
Tram = require('tram-one')    // pull in the library
const app = new Tram()        // create an instance of Tram-One

// create the html function
const html = Tram.html()

// home page to load on the main route
const home = () => {

  // we use html takes in a template literal of your standard HTML
  return html`
    <div>
      🚋 Fun Times on Tram-One!
    </div>
  `
}

// add routes, by using path matchers with function components
app.addRoute('/', home)

// attach the app to an element with the class 'main'
app.start('.main')
```

</details>

<details>
<summary>
Here is an example which makes use of the custom
element, routing, and redux state management.
</summary>

```js
Tram = require('tram-one')    // pull in the library
const app = new Tram()        // create an instance of Tram-One

// create the html function, with no registry
const html = Tram.html()

// create a custom element to display a color option
const colorElement = (attrs, children) => {
  return html`
    <button onclick=${attrs.onclick}>${children}</button>
  `
}

// create a new html function, with color-button
// the key can be any format, capitalize, kebab, whatever!
const cHtml = Tram.html({
  'color-button': colorElement
})

// create a set of actions, that handles changing the color of the app
const colorActions = {
  init: () => 'blue',
  setColor: (currentColor, newColor) => newColor
}

// home page to load on the main route
const home = (store, actions) => {

  // actionCreator that dispatches to the reducer
  const onSetColor = (color) => () => {
    actions.setColor(color)
  }

  // we use cHtml so that we have color-button available in the template
  return cHtml`
    <div>
      I think the best color for this wall is... ${store.color}!
      or maybe it's...
      <color-button onclick=${onSetColor('blue')}>blue</color-button>
      <color-button onclick=${onSetColor('red')}>red</color-button>
      <color-button onclick=${onSetColor('green')}>green</color-button>
    </div>
  `
}

// add routes, by using path matchers with function components
app.addRoute('/', home)
app.addRoute('/404', noPage)

// add actions and save the state as `color` on the store
app.addActions({color: colorActions})
app.start('.main')
```

</details>

### Internal Examples
You can find more examples in the
[examples directory](https://github.com/Tram-One/tram-one/tree/master/examples).<br>
You can run these examples by cloning the repo, and running
```sh
npm install
npm run example
```

### Real Projects out in the world!
Here are some most bodacious examples out in the real world
* [Point-Cards](https://github.com/JRJurman/point-cards) - A planning poker web app that uses websockets (Tram-One v1)
* [Hacktober & Tram-One](https://github.com/Tram-One/hacktoberfest) - A static github pages app that pulls github issues for Hacktoberfest (Tram-One v2)
* [Cocktail-Curator](https://github.com/chtinahow/cocktail-curator) - A mixing drinks app that is powered by a server and external API (Tram-One v2)

## API
Tram-One has a simple interface to help build your web app.

### Static Functions
Because the following functions are static, you call the function off of the
Tram-One dependency. You do not need to have an instance of a Tram-One app to
use these functions.

To remain consistent, all these functions take in options, and return
new functions to be called on their own.

#### `Tram.html([registry])`
_Reference: [hyperx](https://github.com/substack/hyperx),
[belit](https://github.com/Tram-One/belit),
[rbel](https://github.com/aaaristo/rbel)_

`Tram.html` returns a function that can be used to transform
template literals into Node DOM trees.
It can take in an optional [`registry`](#registry), which is a mapping of tag
names to functions that render your custom tags.

<details>
<summary>
Example:
</summary>

```js
/* pageWraper.js (custom element) */
const html = Tram.html()

module.exports = (attrs, children) => {
  return html`
    <div style=${attrs.style}>
      <h1>Tram-One!</h1>
      <div style='padding-left: 2em'>
        ${children}
      </div>
    </div>
  `
}

/* index.js */
const pageWraper = require('./pageWraper')
const html = Tram.html({
  // can map with kebab
  'page-wraper': pageWraper,
  // or with capitalization
  'PageWraper': pageWraper,
  // or whatever
  'wrap': pageWraper
})

const home = () => {
  return html`
    <wrap>
      This is my shiny app!
    </wrap>
  `
}
```

</details>

#### `Tram.svg([registry])`
_Reference: [hyperx](https://github.com/substack/hyperx),
[belit](https://github.com/Tram-One/belit),
[rbel](https://github.com/aaaristo/rbel)_

`Tram.svg` is the same as [`Tram.html`](#tramhtmlregistry), but will create
elements in the appropriate SVG namespace. Use this method if you're building
components that are SVG.

#### `Tram.dom([namespace, registry])`
_Reference: [hyperx](https://github.com/substack/hyperx),
[belit](https://github.com/Tram-One/belit),
[rbel](https://github.com/aaaristo/rbel)_

`Tram.dom` is the generic version of [`Tram.html`](#tramhtmlregistry) and
[`Tram.svg`](#tramsvgregistry).
It is the driving function that builds document trees, and can be
used whenever you need to use a namespace other than XHTML and SVG.

#### `Tram.route()`
`Tram.route` is a static method which is a shorthand for creating
the subroutes for the [`app.addRoute`](#appaddroutepath-page-subroutes)
method. The resulting function takes in [`path`](#path),
[`component`](#top-level-component), and
[`subroutes`](#subroute), mimicking the interface used in
[`app.addRoute`](#appaddroutepath-page-subroutes).

See [`app.addRoute`](#appaddroutepath-page-subroutes) for a an example of
nested routes using `Tram.route`.

### `new Tram([options])`
`new Tram()` returns an instance of a Tram-One app. The constructor
takes in an [`options`](#constructor-options) object.

<details>
<summary>
Example:
</summary>

```js
/* index.js */
// let's have all routes go to home
const app = new Tram({defaultRoute: '/'})
const html = Tram.html()

const home = (state) => {
  return html`<div>This is my shiny app!</div>`
}

app.addRoute('/', home)
```

</details>

#### Constructor Options
Below are a list of options that can be set when making a Tram-One app.

|option        |description                                             |default value|type   |
|--------------|--------------------------------------------------------|-------------|-------|
|`defaultRoute`|if we fail to find a route, which route we should render|'/404'       |string |

### App Functions
The following functions should be called on an instance of a Tram-One app (see
the app [`constructor`](#new-tramoptions) above).

These functions all return an instance of the app, so that it is easy to chain
one after the other.

#### `app.addActions(actionGroups)`
_Reference: [hover-engine](https://github.com/Tram-One/hover-engine)_

`app.addActions` adds a set of actions that can be triggered in the instance
of a Tram-One app. It takes in one argument, [`actionGroups`](#action-group)

<details>
<summary>
Example:
</summary>

```js
/* index.js */
const app = new Tram()
const html = Tram.html()

// in this example, `vote` is a number
// but in a larger app, this could be an object
// with multiple key-value pairs
const voteActions = {
  init: () => 0,
  up: (vote) => vote + 1,
  down: (vote) => vote - 1
}

const home = (state, actions) => {
  const upvote = () => {
    actions.up()
  }
  const downvote = () => {
    actions.down()
  }

  return html`
    <div>
      <h1> Votes: ${state.votes} </h1>
      <button onclick=${upvote}>UPVOTE</button>
      <button onclick=${downvote}>DOWNVOTE</button>
    </div>
  `
}

app.addActions({votes: voteActions})
```

</details>

#### `app.addListener(listener)`
_Reference: [hover-engine](https://github.com/Tram-One/hover-engine)_

`app.addListener` adds a function that triggers on every action call. This can
be used to save state in localstorage, or to debug the state of the store as
actions are called. This should not be used to update the DOM, only trigger
side-effects.

It takes in one argument, a [`listener`](#listener).

<details>
<summary>
Example:
</summary>

```js
/* index.js */
const app = new Tram()
const html = Tram.html()

// in this example, `vote` is a number
// but in a larger app, this could be an object
// with multiple key-value pairs
const voteActions = {
  init: () => 0,
  up: (vote) => vote + 1,
  down: (vote) => vote - 1
}

const home = (store, actions) => {
  const upvote = () => {
    actions.up()
  }
  const downvote = () => {
    actions.down()
  }

  return html`
    <div>
      <h1> Votes: ${store.votes} </h1>
      <button onclick=${upvote}>UPVOTE</button>
      <button onclick=${downvote}>DOWNVOTE</button>
    </div>
  `
}

// we want to debug the store as votes come in
const debug = (store, actions) => {
  console.log(store)
}

app.addListener(debug)
app.addActions({votes: voteActions})
```

</details>

#### `app.addRoute(path, page[, subroutes])`
_Reference: [rlite](https://github.com/chrisdavies/rlite)_

`app.addRoute` will associate a [`path`](#path) with a
[`top level component`](#top-level-component).<br>
`path` should be a matchable string for the application. See
[`path`](#path).<br>
`page` should be a [`top level component`](#top-level-component).<br>
`subroutes` should be a list of [`route objects`](#route). The `subroute`
parameter for the [`top level component`](#top-level-component) function is
filled in when a subroute is resolved. See [`subroute`](#subroute).

The `params` object passed into the
[`top level component`](#top-level-component)
will have any path parameters and query params.

<details>
<summary>
Example:
</summary>

```js
/* index.js */
const app = new Tram()
const html = Tram.html()

const homePage = () => {
  return html`<div>This is my shiny app!</div>`
}

const colorPage = (store, actions, params) => {
  const style = `
    background: ${params.color};
    width: 100px;
    height: 100px;
  `
  return html`<div style=${style} />`
}

const noPage = () => {
  return html`<div>Oh no! We couldn't find what you were looking for</div>`
}

app.addRoute('/', homePage)
app.addRoute('/:color', colorPage)
app.addRoute('/404', noPage)
```

</details>

<details>
<summary>
Nested Routes Example:
</summary>

```js
/* index.js */
const app = new Tram()
const html = Tram.html()
const route = Tram.route()

const homePage = (store, actions, params, subroute) => {
  return html`
    <div>
      <h1>This is my shiny new app!</h1>
      ${subroute}
    </div>
  `
}

const animalsPage = (store, actions, params, subroute) => {
  return html`
    <div>
      <h2>Animals Rule</h2>
      ${subroute}
    </div>
  `
}

const dogPage = () => html`<div>Dogs are the best!</div>
const catPage = () => html`<div>Cats are the best!</div>

app.addRoute('/', homePage, [
  route('animals/', colorPage, [
    route('dogs', dogPage),
    route('cats', catPage)
  ])
])
app.addRoute('/:color', colorPage)
app.addRoute('/404', noPage)
```

</details>

#### `app.start(selector[, pathName])`

`app.start` will kick off the app. Once this is called the app is mounted onto the
`selector`.<br>
`selector` can be a node or a css selector (which is fed into
`document.querySelector`).<br>
`pathName` can be an initial path, if you don't want to check the browser's
current path.

This method only works on the client. If you are running Tram on a server, then
use `.toString()`.

Note: setting `pathName` is great for testing, but prevents other routes from
being reached on page reload.

<details>
<summary>
Example:
</summary>

```html
<!-- index.html -->
<html>
  <head>
    <title>Tram One</title>
  </head>
  <body>
    <div class="main"></div>
    <script src="/index.js"></script>
  </body>
</html>
```

```js
/* index.js */
const app = new Tram()
const html = Tram.html()

const homePage = () => {
  return html`<div>This is my shiny app!</div>`
}

app.addRoute('/', homePage)
app.start('.main')
```

</details>

#### `app.mount(selector, pathName, store, actions)`
**WARNING: INTENDED FOR INTERNAL USE ONLY**

`app.mount` matches a route from `pathName`, passes in a `store` and `actions`
object, and either creates a child div, or updates a child div under
`selector`.

This was created to clean up the code in the library, but may be useful for
testing.

**YOU SHOULD NEVER CALL THIS DIRECTLY FOR YOUR APP**

#### `app.toNode(pathName[, store, actions])`

`app.toNode` returns a HTMLNode of the app for a given route and store. The
function matches a route from `pathName`, and either takes in a `store`, or
uses the default store (that's been created by adding reducers).

While initially created to clean up the code in the library, this can be useful
if you want to manually attach the HTMLNode that Tram-One builds to whatever.

#### `app.toString(pathName[, store])`

`app.toString` returns a string of the app for a given route and store. It has
the same interface at `app.toNode`, and basically just calls `.outerHTML` on
the node.

This can be useful if you want to do server-sider rendering or testing.

## Terminology
Below is a list of definitions for objects used when making a Tram-One app.

### Action Groups
```js
actionGroup = { actionName: (state, value, actions) => newState }
actionGroups = { storeName: actionGroup }
```
An action group is a mapping of action names (string) to functions which return
a new value for a single state. Action Groups refer to a [`store`](#store) of
state names (strings) to action groups. Usually a single app has multiple
action groups, which together makes the entire app state.

You see more examples and details in the
[hover-engine](https://github.com/Tram-one/hover-engine#addactionsactiongroups) project.

<details>
<summary>Example</summary>

```javascript
const actionGroup = {
  counter: {
    init: () => 0,
    up: (state) => state + 1
  }
}
```

</details>

### Element
```js
(attributes, children) => DOM
```
An element is a function which takes in `attributes` and `children`. They are
supposed to mimic the interface for a normal html element as much as possible.
They are included in the `registry` when setting up an
[`html`](#tramhtmlregistry) function.

<details>
<summary>Example</summary>

```javascript
/* usage: <CustomList title="Sale">
            <li>Radio</li>
            <li>TV</li>
          </CustomList>
 */
const CustomList = (attrs, children) => html`
  <div>
    <h3>${attrs.title}</h3>
    <ul>
      ${children}
    </ul>
  </div>
`
```

</details>

### Listener
```js
(store, actions, actionName, actionArguments) => side-effect
```

A listener is a function which can be used to debug an application, or trigger
certain side-effects when the state is updated. Many of the properties passed
into a listener are the same as the ones used in
[`top level componenets`](#top-level-components).

For details on the listener object,
[read here on the hover-engine project](https://github.com/Tram-One/hover-engine#addlistenerlistener).

### Path
```js
'/path/with/:path/:params/and?query=variables'
```
A path is a string that describes how to get to different [`routes`](#route) in
a Tram-One app. It can include path variables, query params, and hash values.

You can see more examples and details on the types of routes in the
[rlite](https://github.com/chrisdavies/rlite) project.

### Registry
```js
{ tagName: element }
```
A registry is a mapping of tags to elements. A registry is usually passed into
the static functions that build DOM elements (
[`html`](#tramhtmlregistry), [`svg`](#tramsvgregistry), or
[`dom`](#tramdomnamespace-registry)).
The strings used as values can be of pretty much any syntax, allowing you to
write React like capitalized tags, web-component like hyphenated tags, or
lowercase single words, like real HTML tags.

It is recommended that you write elements in separate files, and require them
in your registry.

<details>
<summary>Example</summary>

```js
const html = Tram.html({
  'my-beginning': require('./elements/my-beginning.js'),
  'Ending': () => require('./elements/Ending.js'),
  'content': () => require('./elements/content.js')
})
```

</details>

### Route
```js
{ path, component, subroutes }
```
A Route is the association between a [`path`](#path), a
[`top level component`](#top-level-component), and any [`subroutes`](#subroute)
that may exist under that route (if a different top level component would
render as a result).

When building [`subroutes`](#subroute), you should use the static method
[`Tram.route`](#tramroute) to build route objects.

### Store
```js
{ state: value }
```
A store is a collection of values. It is updated by calling
[`actions`](#actions), and passed into the [top level components]
(#top-level-component).

### Subroute
```js
[route(path, topLevelComponent, subroutes), ...]
```
A subroute is a [`top level component`](#top-level-component) that should
render inside of another top level component based on the [`path`](#path).
Subroutes let you describe your views as containers of other views based on
the path. This is useful for many cases, most commonly if you have a
surrounding header, nav, and footer for every page.

<details>
<summary>Example</summary>

```js
const app1 = (store, actions, params, subroute) => html`
  <div>
    <div>My First App</div>
  </div>
`

const app2 = (store, actions, params, subroute) => html`
  <div>
    <div>My Better App</div>
  </div>
`

const pageWrapper = (store, actions, params, subroute) => html`
  <div>
    <h1>My Cool App</h1>
    ${subroute}
    <footer>Copyright 2018</footer>
  </div>
`
app.addRoute('/', pageWrapper, [
  route('first', app1),
  route('second', app2)
])
```

</details>

### Top Level Component
```js
(store, actions, params, subroute) => DOM
```
Top level components are functions that take in `store`, `actions`, `params`,
and `subroute`. Top level components are passed in the
[`app.addRoute`](#appaddroutepath-page-subroutes) function, and
subsequent subroutes. They are how you connect the logic of your app to the
views. Since you usually have one per route, it is fair to also call these
pages.

`store` is a mapping of the different reducers (strings) to their value
(see [`store`](#store)).
`actions` is an object with methods from the defined reducers (see [`action groups`](#action-group).
`params` are any path or query variable that is inherited from the route (see
[`path`](#path)).
`subroute` is the [`subroute`](#subroute) view, if one is resolved. It is
another top level component to render inside the view.

<details>
<summary>Example</summary>

```javascript
// example route /book/:bookId/pages/:pageId
const page = (store, actions, params, subroute) => {
  const nextPage = params.pageId + 1
  return html`
    <div>
      <h2>Book ${params.bookId}</h2>
      <div>You are on page ${params.pageId}</div>
      <a href="/book/${params.bookId}/pages/${nextPage}">Next Page</a>
    </div>
  `
}
```

</details>

## Development

### Slack

If you want to start contributing, need help, or would just like to say hi,
[join our slack channel](https://join.slack.com/t/tram-one/shared_invite/enQtMjY0NDA3OTg2MzQyLWUyMGIyZTYwNzZkNDJiNWNmNzdiOTMzYjg0YzMzZTkzZDE4MTlmN2Q2YjE0NDIwMGI3ODEzYzQ4ODdlMzQ2ODM)!

### Commands

If you decide to clone this repo, there are several commands included in the
`package.json` to help you develop.
- `npm run lint`, runs eslint in the project
- `npm run example`, kicks off one of the example apps in this repo
- `npm run build`, builds the project and creates a distributable
- `npm run test-dev`, hosts the tests to be launched in a browser
- `npm run test`, runs tests against all available browsers on the machine

### Todo

Check out our [Issues on Github](https://github.com/Tram-One/tram-one/issues).
PRs welcome!
