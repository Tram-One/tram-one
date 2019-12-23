# Tram-One Cheatsheet

<style>
	pre code {
		font-size: 66.4%;
	}
	ul {
		padding-left: 22px;
	}
	pre {
		overflow-x: hidden;
		margin-bottom: 0px;
	}
	.sheet-block {
		flex-grow: 1;
		margin: 1em;
		font-size: 0.8em;
	}
	.cheat-sheet {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
	}
</style>

<div class="cheat-sheet">

<div class="sheet-block">

#### New Component
```javascript
const html = registerHtml()
const CustomList = (props, children) => {
	return html`
		<div>
			${props.title}
			<ul>${children}</ul>
		</div>
	`
}
```
* Takes props and children

</div>

<div class="sheet-block">

#### Using Components
```javascript
import List from './List'
const html = registerHtml({
  'tram-list': List
})
```
* tag-name is used in `html`
* can be be `List` like React
* can be non-hyphanated, `list`

</div>

<div class="sheet-block">

#### Component State
```javascript
const [ color, setColor ] = useObservable('blue')
const toggleColor = () => setColor('red')
```
* initial state can be an object or array
* avoid setter if using an object or array

</div>

<div class="sheet-block">

#### Global State
```javascript
const [ list, setList ] = useGlobalObservable('todos', [])
const onAddItem = newItem => list.push(newItem)
```
* doesn't need an initial value<br/>
if another component sets a default value

</div>

<div class="sheet-block">

#### Testing Routes
```javascript
if (useUrlParams('/about')) return html`<about />`
if (useUrlParams('/api')) return html`<api />`
return html`<home-page />`
```
* mismatched route returns false
* matched route returns object

</div>

<div class="sheet-block">

#### Route Parameters
```javascript
const { accountId } = useUrlParams('/:accountId/')
```
* also reads query params

</div>
<div class="sheet-block">

#### Effects
```javascript
useEffect(() => {
	document.title = "Tram-One Page"
	return () => console.log('cleanup triggered')
})
```
* cleanup will call for every component re-render

</div>

<div class="sheet-block">

#### Async Effects
```javascript
const [user] = useObservable({ accountId: null })
useEffect(async () => {
	const userData = fetch(`/user/${user.accountId}`)
	user.profile = userData.profile
})
```
* effects trigger if observable updates

</div>

</div>
