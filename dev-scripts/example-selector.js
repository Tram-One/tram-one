const path = require('path')
const inquirer = require('inquirer')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const opn = require('opn')
const internalIp = require('internal-ip')

const question = {
  type: 'list',
  name: 'example',
  message: 'What example would you like to run?',
  choices: [
    new inquirer.Separator('-- Simple Examples --'),
    'using-actions',
    'using-routes',
    'using-custom-elements',
    'using-everything',
    'using-listeners',
    new inquirer.Separator('-- Tiny Apps --'),
    'todo-pages',
    'todo-app',
    'image-carousel',
    'clock-example'
  ]
}

inquirer.prompt([question]).then((answer) => {
  console.log(`running ${answer.example}`)

  const webpackConfig = {
    entry: {
      app: [`./examples/${answer.example}/index.js`]
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'bundle.js'
    }
  }

  const compiler = webpack(webpackConfig)
  const server = new WebpackDevServer(compiler, {
    stats: {
      colors: true
    },
    publicPath: '/',
    contentBase: `./examples/${answer.example}`,
    historyApiFallback: {
      index: 'index.html'
    }
  })

  const port = 5000
  const ip = internalIp()

  server.listen(port, ip, () => {
    console.log(`Running ${answer.example} on http://${ip}:${port}`)
    // opn(`http://${ip}:${port}`)
  })
})
