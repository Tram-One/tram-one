module.exports = results => {
  const errors = results.filter(result => result.type === 'error')
  if (errors.length > 0) {
    throw new Error(errors)
  } else {
    process.exit()
  }
}
