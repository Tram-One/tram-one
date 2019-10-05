// in reality, this should be either:
// const { ... } = require('tram-one')
// or
// import { ... } from 'tram-one'

const {start, registerHtml} = window['tram-one']

// elements are separated into blocks so that
// register html can be called correctly
// in reality, these would be separate files

let footer; let pageWrapper; let home

// create footer element
{
	const html = registerHtml()

	footer = () => {
		return html`
      <div style="font-style: italic; padding-top: 1em;">
        Tram-One Created By Jesse Jurman
      </div>
    `
	}
}

// create page wrapper element
{
	const html = registerHtml({
		footer
	})

	pageWrapper = (attrs, children) => {
		return html`
      <div>
        <h3>Tram-One</h3>
        ${children}
        <footer />
      </div>
    `
	}
}

// create the home page
{
	const html = registerHtml({
		'page-wrapper': pageWrapper
	})

	home = () => {
		return html`
      <page-wrapper>
        This is the custom-elements example!
        <br />

        Tram-One
        uses <a href="https://github.com/Tram-One/ninlil">ninlil</a> (a fork of rbel), <a href="https://github.com/Tram-One/belit">belit</a> (a fork of nanohtml),
        and <a href="https://github.com/Tram-One/hyperz">hyperz</a> (a fork of hyperx), to render tagged and custom elements.
        <br /><br />

        Honestly though, special thanks goes out
        to <a href="https://github.com/aaaristo">Andrea Gariboldi</a>
        for building rbel, which does the custom element magic.
      </page-wrapper>
    `
	}
}

start('.main', home)
