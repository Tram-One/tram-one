module.exports = {
  init: () => Object({
    selected: 0
  }),

  onSelectImage: (state, slectedNumber) => Object.assign({}, state, {
    selected: slectedNumber
  }),
  onPreviousSelect: (state, size) => Object.assign({}, state, {
    selected: state.selected - 1 < 0 ? size - 1 : state.selected - 1
  }),
  onNextImage: (state, size) => Object.assign({}, state, {
    selected: (state.selected + 1 ) % size
  })
}
