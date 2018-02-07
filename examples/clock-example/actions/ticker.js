module.exports = {
  init: () => ({wound: false, date: new Date()}),
  wind: () => ({wound: true, date: new Date()}),
  tick: () => ({wound: true, date: new Date()})
}
