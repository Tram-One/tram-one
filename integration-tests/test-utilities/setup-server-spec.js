const express = require('express')
const path = require('path')
const Nightmare = require('nightmare')
const chalk = require('chalk')
const processResults = require('./process-results')
const endSpec = require('./end-spec')

module.exports = async (title, assets, spec, {debugging = false} = {}) => {
  console.log(chalk.yellow(title))

  const hold = () => new Promise(resolve => {})

  const nightmare = Nightmare({ show: debugging })

  // setup express server for running the simple page-spec
  const app = express()
  const port = 1228
  app.use(express.static(path.join(__dirname, '../../dist/')))
  app.use(express.static(path.join(assets)))

  try {
    // start server hosting test app
    const server = await app.listen(port, () => console.log(`Spec App is Running on ${chalk.blue(`http://localhost:${port}`)}`))

    // collect results from running the spec
    const results = await spec(nightmare)

    // log the results
    processResults(results)

    // if we are debugging don't close the server yet
    if (debugging) await hold()

    // stop the server
    await server.close()

    // exit with different code based on errors
    endSpec(results)
  }
  catch (runtimeError) {
    console.error(runtimeError)
    endSpec([{type: 'error'}])
  }

}
