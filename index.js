const xtend = require('xtend');
const nanorouter = require('nanorouter');
const belCreateElement = require('bel').createElement;
const rbelRegister = require('rbel');
const minidux = require('minidux');

class Tram {
  constructor() {
    this.router = nanorouter({ default: '/404' });
    this.reducers = {};
    this.state = {};
  }

  addRoute(path, page) {
    this.router.on(path, (pathParams) => {
      const completeState = xtend(
        this.store.getState(),
        {dispatch: this.store.dispatch},
        pathParams
      );
      return page(completeState);
    });
  }

  addReducer(field, reducer, state) {
    this.reducers[field] = reducer;
    this.state[field] = state;
  }

  start(target, pathName) {
    const reducers = minidux.combineReducers(this.reducers);
    console.log(this.state)
    this.store = minidux.createStore(reducers, this.state);

    this.store.subscribe( (state) => {
      // USE YO-YO TO RE-RENDER
      console.log(state);
    });

    const routePath = pathName || window.location.href.replace(window.location.origin, '');
    const pageComponent = this.router(routePath);
    target.appendChild(pageComponent);
  }

}

const html = (registry) => {
  return rbelRegister(belCreateElement, registry || {});
}

module.exports = Tram;
module.exports.html = html;
