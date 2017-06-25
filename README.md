# Tram-One
🚋 Batteries Included View Framework

## Install
```sh
npm install tram-one --save
```

## Summary
Tram-One is a view framework for developers who want to jump straight into
building on the web. At its core, Tram-One is a collection of a few packages
that gives you the tools to start working right away. That is to say...
Batteries Included!

### Why?
Tram-One is a project built to make exposing custom elements easy, and to
have redux-like state management, and basic routing by default. It was created
out of  the frustration of having to scaffold the same dependencies over and over
again.  

Tram-One was also created to avoid a lot of the syntax that locks you into
frameworks like Vue and React. The components written here can mimic the syntax
you're already familiar, or help you create pure HTML friendly code.

### Some Assembly Required
While Tram-One comes with several packages to help you on your way, it does
not include a way to bundle and run your code. The obvious answers are
[webpack](https://www.npmjs.com/package/webpack),
[browserify](https://www.npmjs.com/package/browserify), etc...  

If you want to quickly get started though, check out
[budo](https://www.npmjs.com/package/budo)!

## Packages
Tram-One is a collection of excellent packages.  
Here are the different package that make Tram-One possible...  

For Rendering:
  - [hyperx](https://github.com/substack/hyperx)
  - [bel](https://github.com/shama/bel)
  - [rbel](https://github.com/aaaristo/rbel)

For Routing:
  - [nanorouter](https://github.com/yoshuawuyts/nanorouter)

For State Management:
  - [yo-yo](https://github.com/maxogden/yo-yo)
  - [minidux](https://github.com/freeman-lab/minidux)
  - [xtend](https://github.com/Raynos/xtend)

While not used in this project, Tram-One is heavily inspired by the
[choo](https://github.com/yoshuawuyts/choo)
view framework.  
Special thanks go out to the people on that project, and its
creator, [Yoshua Wuyts](https://github.com/yoshuawuyts).   
If you like some of the things here, definitely go check out that project.

## Annotated Examples
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

// create a reducer, that handles changing the color of the app
const colorReducer = (state, action) => {
  switch(action.type) {
    case('SET_COLOR'):
      return action.color
    default:
      return state            // you must ALWAYS return the state by default
  }
}

// home page to load on the main route
const home = (state) => {

  // actionCreator that dispatches to the reducer
  const onSetColor = (color) => () => {
    state.dispatch({type: 'SET_COLOR', color})
  }

  // we use cHtml so that we have color-button available in the template
  return cHtml`
    <div>
      I think the best color for this wall is... ${state.color}!
      or maybe it's...
      <color-button onclick=${onSetColor('blue')}>blue</color-button>
      <color-button onclick=${onSetColor('red')}>red</color-button>
      <color-button onclick=${onSetColor('green')}>green</color-button>
    </div>
  `
}

// page to render on the unmatched routes (which by default go to 404)
const noPage = (state) => {
  return cHtml`
    <div>
      <h1>404!</h1>
      Sorry pal, no page here...
    </div>
  `
}

// add routes, by using path matchers with function components
app.addRoute('/', home)
app.addRoute('/404', noPage)

// add reducer, map all state values to 'color', and set the initial value to 'blue'
app.addReducer('color', colorReducer, 'blue')
app.start('.main')
```

</details>


You can find more examples in the
[examples directory](https://github.com/JRJurman/tram-one/tree/development/examples).  
You can run these examples by cloning the repo, and running
```sh
npm install
npm run example
```

## API
Tram-One has a simple interface to help build your web app.

### `Tram.html([registry])`
_Reference: [hyperx](https://github.com/substack/hyperx),
[bel](https://github.com/shama/bel),
[rbel](https://github.com/aaaristo/rbel)_

`Tram.html` returns a function that can be used to transform
template literals into Node DOM trees.
It can take in an optional `registry`, which is a mapping of tag
names to functions that render your custom tags.

Because it is static, you call the function off of Tram-One, you
do not need to have an instance of Tram-One to use this function.

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

const home = (state) => {
  return html`
    <wrap>
      This is my shiny app!
    </wrap>
  `
}
```

</details>

### `Tram.constructor([options])`
`new Tram()` returns an instance of the Tram. The constructor
takes in an `options` object, which can have a `defaultRoute`.
By default, this is `/404`, but you can set it to whatever path
you want to load when path matching fails.

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

### `app.addReducer(key, reducer, state)`
_Reference: [minidux](https://github.com/freeman-lab/minidux)_

`app.addReducer` adds a reducer onto the current instance of Tram.  
It takes in three arguments:  
`key`, which is where the state will be exposed,  
`reducer`, the function that updates state,  
`state`, the initial state of the reducer.

Note, `state` here will be exposed in the views as `state[key]`.

The `reducer` should be a function, that takes in `state`, and an `action`.   
`state` can be anything you want, a number, object, whatever.  
At the end of the reducer, you should ALWAYS return this by default.   
`action` should be an object, with a `type` property.

<details>
<summary>
Example:
</summary>

```js
/* index.js */
const app = new Tram()
const html = Tram.html()

// in this example, state is a number (the votes)
// but in a larger app, this could be an object
// with multiple key-value pairs
const counterReducer = (state, action) => {
  switch(action.type) {
    case('UP'):
      return state + 1
    case('DOWN'):
      return state - 1
    default:
      return state
  }
}

const home = (state) => {
  const upvote = () => {
    state.dispatch({type: 'UP'})
  }
  const downvote = () => {
    state.dispatch({type: 'DOWN'})
  }

  return html`
    <div>
      <h1> Votes: ${state.votes}
      <button onclick=${upvote}>UPVOTE</button>
      <button onclick=${downvote}>DOWNVOTE</button>
    </div>
  `
}

app.addReducer('votes', counterReducer, 0)
```

</details>

### `app.addRoute(path, page)`
_Reference: [nanorouter](https://github.com/yoshuawuyts/nanorouter)_

`app.addRoute` will associate a component with a route.  
`path` should be a matchable route for the application. Look up
[nanorouter](https://github.com/yoshuawuyts/nanorouter)
to see all the possible options here.  
`page` should be a function that takes in a `state` object for the entire app.

The state passed into `page` will have any path parameters for the route as well.

<details>
<summary>
Example:
</summary>

```js
/* index.js */
const app = new Tram()
const html = Tram.html()

const homePage = (state) => {
  return html`<div>This is my shiny app!</div>`
}

const colorPage = (state) => {
  const style = `
    background: ${state.color};
    width: 100px;
    height: 100px;
  `
  return html`<div style=${style}></div>`
}

const noPage = (state) => {
  return html`<div>Oh no! We couldn't find what you were looking for</div>`
}

app.addRoute('/', homePage)
app.addRoute('/:color', colorPage)
app.addRoute('/404', noPage)
```

</details>

### `app.start(selector, [pathName])`

`app.start` will kick off the app. Once this is called, all the reducers
are combined, and the app is mounted onto the `selector`.  
`selector` can be a node or a css selector (which is fed into
`document.querySelector`).  
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
/* index.html */
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

const homePage = (state) => {
  return html`<div>This is my shiny app!</div>`
}

app.addRoute('/', homePage)
app.start('.main')
```

</details>

### `app.mount(selector, pathName, state)`
**WARNING: INTENDED FOR INTERNAL USE ONLY**

`app.mount` matches a route from `pathName`, passes in a `state` object,
and either creates a child div, or updates a child div under `selector`.

This was created to clean up the code in the library, but may be useful for
testing.

**YOU SHOULD NEVER CALL THIS DIRECTLY FOR YOUR APP**

### `app.toNode(pathName, [state])`

`app.toNode` returns a HTMLNode of the app for a given route and state. The
function matches a route from `pathName`, and either takes in a `state`, or
uses the default state (that's been created by adding reducers).

While initially created to clean up the code in the library, this can be useful
if you want to manually attach the HTMLNode that Tram-One builds to whatever.

### `app.toString(pathName, [state])`

`app.toString` returns a string of the app for a given route and state. It has
the same interface at `app.toNode`, and basically just calls `.outerHTML` (or
`toString` on the server) on the node.

This can be useful if you want to do server-sider rendering or testing.

## Development

If you decide to clone this repo, there are several commands included in the
`package.json` to help you develop.
- `npm run lint`, runs eslint in the project
- `npm run example`, kicks off one of the example apps in this repo
- `npm run build`, builds the project and creates a distributable
- `npm run test-dev`, hosts the tests to be launched in a browser
- `npm run test`, runs tests against all available browsers on the machine

## Todo

Check out our [Issues on Github](https://github.com/JRJurman/tram-one/issues).
PRs welcome!
