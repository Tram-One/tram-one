const xtend = require('xtend');
const nanorouter = require('nanorouter');
const belCreateElement = require('bel').createElement;
const rbelRegister = require('rbel');
const createStore = require('minidux').createStore;

class Tram {
  constructor() {
    this.router = nanorouter({ default: '/404' });
    this.state = {};
  }

  addRoute(path, handler) {
    this.router.on(path, (pathParams) => {
      const completeState = xtend(this.state, pathParams);
      return handler(completeState);
    });
  }

  addReducer() {

  }

  start(target, pathName) {
    const routePath = pathName || window.location.href.replace(window.location.origin, '');
    const pageComponent = this.router(routePath);
    target.appendChild(pageComponent);
  }

}

const html = (registry) => {
  const render = rbelRegister(belCreateElement, registry || {});

  return render;
}

module.exports = Tram;
module.exports.html = html;
