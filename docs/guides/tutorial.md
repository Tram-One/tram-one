## Tutorial

In this tutorial, we'll be building a simple counter app, which can increment or decrement values for keeping score in a game, or track of counters, or whatever!

Here's a live demo of the app running in CodeSandbox:

<iframe src="https://codesandbox.io/embed/tram-one-sample-app-ld5ge?fontsize=14&view=preview" title="Tram-One Counter App" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

In this tutorial, we'll go over the basics for building a component, and some of the hooks that you can use when building an app. You can either use [tram-one-express](/tram-one-express) if you would like to use your own editor, or use our [codesandbox](https://codesandbox.io/s/tramone-sample-app-lvt6u) if you would like to try it on the browser, no installation required!

After getting our project setup, we're going to create a new component in our `components` folder. We'll name it `CounterItem`. In this directory, we'll create two files, `CounterItem.js`, and `index.js`.

`index.js` will expose our component for the rest of the project, and should look like this:
```javascript
export { default } from './CounterItem';
```

`CounterItem.js` will be the component we want to render, for now we'll use this empty component template:
```javascript
import { registerHtml } from "tram-one"

const html = registerHtml()

export default () => {
  return html`
    <div class="counter-item">
      Example Counter
    </div>
  `
}
```

We have some dummy content in our counter, just so that we can validate it appears in our page. Let's try adding a counter item now!

In `index.js` at the root of the project, you'll notice a call to `registerHtml` which currently takes in a `ColorHeader`. We'll want to add our `CounterItem` here so that we can use that on the page.

Update `index.js` at the root of the project with the following changes:
```javascript
import { registerHtml, start } from 'tram-one';
import ColorHeader from './components/ColorHeader';
import CounterItem from './components/CounterItem'; // + Add our CounterItem from the components folder
import './styles.css';

const html = registerHtml({
  ColorHeader, CounterItem // + Add CounterItem as a tag we can use in HTML
});

const home = () => {
  return html`
    <div>
      <ColorHeader />
      <!-- + add the counter items to our template -->
      <CounterItem />
      <CounterItem />
    </div>
  `;
};

start('#app', home);
```

We should now see our two counters on the rendered webpage, each saying `Example Counter`. Now when we go and update our component, we should see the changes live!

Okay, back in `CounterItem.js`, let's use the `useState` hook so that each `CounterItem` can keep track of it's own value.

```javascript
import { registerHtml, useState } from "tram-one" // + import useState from the tram-one framework

const html = registerHtml()

export default () => {
  const [count, setCount] = useState(0) // + initialize count and setCount
  return html`
    <div class="counter-item">
      <!-- + display our count in the template -->
      ${count}
    </div>
  `
}
```

`useState` returns two things, the value of the thing we're keeping track of (in this case, a `count`), and a way to update it (which we've named `setCount`). `useState` also takes in a default value, so we've decided to start these counters at 0.

But right now there's no way to change them! Let's add some buttons so that we can increment and decrement these values!

```javascript
import { registerHtml, useState } from "tram-one"

const html = registerHtml()

export default () => {
  const [count, setCount] = useState(0)
  // + decrement and increment methods that we'll call in our buttons
  const decrementCount = () => setCount(count - 1)
  const incrementCount = () => setCount(count + 1)
  return html`
    <div class="counter-item">
      ${count}
      <!-- + buttons for changing the count -->
      <button onclick=${decrementCount}>-</button>
      <button onclick=${incrementCount}>+</button>
    </div>
  `
}
```

Now you should be able to interact with the different counters on the home page, and they should update correctly, going up when you hit `+`, and down when you hit `-`.

While we're here, let's also add an input tag, just so that users can label what the counter is for.

```javascript
import { registerHtml, useState } from "tram-one"

const html = registerHtml()

export default () => {
  const [label, setLabel] = useState('') // + state for our input tag
  const [count, setCount] = useState(0)
  const onUpdateLabel = (event) => setLabel(event.target.value) // + update function for our input tag (can be called on keyup, keydown, change, etc...)
  const decrementCount = () => setCount(count - 1)
  const incrementCount = () => setCount(count + 1)
  return html`
    <div class="counter-item">
      <!-- input where user can set a label -->
      <input value=${label} onchange=${onUpdateLabel} />
      ${count}
      <button onclick=${decrementCount}>-</button>
      <button onclick=${incrementCount}>+</button>
    </div>
  `
}
```

Awesome! Our counters should now be working exactly how we expect, we can enter names for the counters, and we can increment and decrement them.

The last part will be allowing the user to create new ones! For this we'll want to revisit the root `index.js`, and make it so that we create whatever number of counters we want with just a mock value.

```javascript
import { registerHtml, start } from 'tram-one';
import ColorHeader from './components/ColorHeader';
import CounterItem from './components/CounterItem';
import './styles.css';

const html = registerHtml({
  ColorHeader, CounterItem
});

const home = () => {
  const totalCounters = 5 // + hard coded value of the number of counters we want

  // + transform the number of counters into a list of CounterItem components
  const counterItems = Array(totalCounters).fill()
    .map(() => html`<CounterItem />`)

  return html`
    <div>
      <ColorHeader />
      <!-- + insert our list of counterItems -->
      ${counterItems}
    </div>
  `;
};

start('#app', home);
```

We should now have five counters on our browser! This is possible because you can have an array of Tram-One components, and inject them in an `html` template. In this case, we created an empty array of five elements, and transformed all of them into CounterItems.

But instead of using a hard-coded value, we'll need a value that we can use, and update throughout the app. In this case, we'll use the `useGlobalState` hook.

```javascript
import { registerHtml, useGlobalState, start } from 'tram-one'; // + import useGlobalState from tram-one
import ColorHeader from './components/ColorHeader';
import CounterItem from './components/CounterItem';
import './styles.css';

const html = registerHtml({
  ColorHeader, CounterItem
});

const home = () => {
  // + instead of hard coding the value, the useGlobalState hook will keep track of it
  // + we also define a method to increment the total number of counters
  const [totalCounters, setTotalCounters] = useGlobalState('total-counters', 0)
  const incrementTotalCounters = () => setTotalCounters(totalCounters + 1)

  const counterItems = Array(totalCounters).fill()
    .map(() => html`<CounterItem />`)

  return html`
    <div>
      <ColorHeader />
      ${counterItems}
      <!-- button on the page to increment the number of counters -->
      <button onclick=${incrementTotalCounters}>Create New Counter</button>
    </div>
  `;
};

start('#app', home);
```

`useGlobalState` is similar to `useState`, however we can pass a key in to identify and pull it's value in other components (in this case, the key is `total-counters`).

While in this tutorial we won't be using `total-counters` in other places, if you wanted to make the "Create New Counter" button a separate component, or read in the total number of counters in another place, this would enable it (certainly for this tutorial alone, `useState` would suffice).

And now you have a completed counter app! Some CSS and tests would go nicely, but that will be an exercise for the reader. If you had any questions, comments, or issues while going through the tutorial, feel free to [join our slack](https://join.slack.com/t/tram-one/shared_invite/enQtMjY0NDA3OTg2MzQyLWUyMGIyZTYwNzZkNDJiNWNmNzdiOTMzYjg0YzMzZTkzZDE4MTlmN2Q2YjE0NDIwMGI3ODEzYzQ4ODdlMzQ2ODM), or [post on our github issues](https://github.com/Tram-One/tram-one/issues)!
