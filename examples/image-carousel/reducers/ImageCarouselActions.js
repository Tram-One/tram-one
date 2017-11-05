module.exports = (size) => Object({
  init: () => 0,
  onSelectImage: (selected, newSelection) => newSelection,
  onPreviousSelect: (selected) => selected - 1 < 0 ? size - 1 : selected - 1,
  onNextImage: (selected) => (selected + 1) % size
})
