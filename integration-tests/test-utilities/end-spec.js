module.exports = results => {
  const errors = results.filter(result => result.type === 'error')
  process.exit(errors.length > 0 ? 1 : 0)
}
