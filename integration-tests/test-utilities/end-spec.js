module.exports = results => {
  const errors = results.filter(result => result.type === 'error')

  const hasErrors = errors.length > 0
  if (!hasErrors) {
    // if there are no errors, we can exit now
    process.exit(0)
  }

  console.error(`\n${errors.length} Integartion Tests Failed\n`)
  errors.forEach(error => console.log(error.message))
  process.exit(1)
}
