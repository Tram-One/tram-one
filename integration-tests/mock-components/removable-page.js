const { registerHtml, useObservable } = require('../../src/tram-one')
const home = require('./home')
const removable = require('./removable')

const html = registerHtml({
	home,
	removable
})

module.exports = () => {
	const [showRemovable, setShowRemovable] = useObservable(true)
	const [removeTriggerd, setRemoveTriggered] = useObservable(false)

	const hideRemovable = () => setShowRemovable(false)
	const triggerRemovable = () => setRemoveTriggered(true)

	const page = showRemovable ? html`
		<div>
			<button data-testid="hide-removable" onclick=${hideRemovable}>Hide Removable</button>
			<removable onCleanupEffect=${triggerRemovable} />
		</div>
	` : ''

	return html`
		<home>
			${page}
			${removeTriggerd ? 'Remove was triggered!' : 'Remove not triggered.'}
		</home>
	`
}
