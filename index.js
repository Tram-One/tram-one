const xtend = require('xtend');
const nanorouter = require('nanorouter');
const belCreateElement = require('bel').createElement;
const rbelRegister = require('rbel');
const minidux = require('minidux');
const yoyoUpdate = require('yo-yo').update;

class Tram {
  constructor() {
    this.router = nanorouter({ default: '/404' });
    this.reducers = {};
    this.state = {};
  }

  addRoute(path, page) {
    this.router.on(path, (pathParams) => (state) => {
      const completeState = xtend(
        state, {dispatch: this.store.dispatch},
        pathParams
      );
      return page(completeState);
    });
  }

  addReducer(field, reducer, state) {
    this.reducers[field] = reducer;
    this.state[field] = state;
  }

  start(selector, pathName) {
    const target = document.querySelector(selector);

    const reducers = minidux.combineReducers(this.reducers);
    this.store = minidux.createStore(reducers, this.state);

    this.store.subscribe( (state) => {
      const routePath = pathName || window.location.href.replace(window.location.origin, '');
      const pageComponent = this.router(routePath);

      yoyoUpdate(target, pageComponent(state));
    });

    const routePath = pathName || window.location.href.replace(window.location.origin, '');
    const pageComponent = this.router(routePath);
    yoyoUpdate(target, pageComponent(this.store.getState()));
  }

}

const html = (registry) => {
  return rbelRegister(belCreateElement, registry || {});
}

module.exports = Tram;
module.exports.html = html;
