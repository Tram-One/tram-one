<p align="center"><a href="http://tram-one.io/" target="_blank"><img src="https://unpkg.com/@tram-one/tram-logo@4" width="128"></a></p>

<div align="center">
  <a href="https://unpkg.com/tram-one/dist/tram-one.cjs">
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/badges/cjs.svg?sanitize=true" alt="Common JS build">
  </a>
  <a href="https://unpkg.com/tram-one/dist/tram-one.js">
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/badges/umd.svg?sanitize=true" alt="UMD build">
  </a>
  <a href="https://unpkg.com/tram-one/dist/tram-one.mjs">
    <img src="https://github.com/Tram-One/tram-one/raw/master/docs/badges/mjs.svg?sanitize=true" alt="ES Module build">
  </a>
</div>
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
    <a href="https://discord.gg/dpBXAQC">
    <img src="https://img.shields.io/badge/discord-join-5865F2.svg?style=flat" alt="Join Discord">
  </a>
</div>

# Tram-One

Modern View Framework for Vanilla Javascript
<br>
<br>

## Summary

Tram-One is a Modern View Framework that has advance features like hooks, observables, and JSX-like template components, all in plain vanilla javascript.

Tram-One takes inspiration from frameworks like Choo, React, and Svelte, and provides a rich feature set without additional libraries.

[Visit the website for a complete one-stop-shop with everything you need to know about Tram-One.](http://tram-one.io/)

[If you have any questions from this page or about Tram-One, or just want to say hi, join our Discord!](https://discord.gg/dpBXAQC)

```javascript
import { registerHtml, start } from 'tram-one';

const html = registerHtml();
const home = () => {
	return html`
		<main>
			<h1>Tram-One</h1>
			<h2>A Modern View Framework For Vanilla Javascript</h2>
		</main>
	`;
};

start('#app', home);
```

### Why?

Tram-One is a project that emphasizes vanilla JS and HTML syntax, while providing the features of modern JS frameworks. It is born out of love of the JSX syntax, and an attempt to build something unique with existing open source libraries.

While Tram-One makes use of many dependencies, an effort has been made to expose those dependencies in a way that will hopefully
encourage other developers to mix-and-match their own libraries, make improvements, and potentially
build off of what is here to make their own front-end frameworks!

### Is Tram-One for Javascript or Typescript?

Both! While the source code and type checking exist in Typescript, smart editors (such as Visual Studio Code), will make use of
the Typescript annotations regardless of what language you work in!

## This Repo and the Tram-One Org

This repo contains the main Tram-One framework, which can be installed and
used to make web-apps. [The Tram-One org](https://github.com/Tram-One)
includes many of the dependencies as well as the websites and generators for the project.
The dependencies, while made (or modiefied) for Tram-One, can be used in other projects.

### Discord

If you want to start contributing, need help, or would just like to say hi,
[join our discord](https://discord.gg/dpBXAQC)!
