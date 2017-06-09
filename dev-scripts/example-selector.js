const inquirer = require('inquirer')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const path = require('path')

const port = 5000

const question = {
  type: 'list',
  name: 'example',
  message: 'What example would you like to run?',
  choices: [
    new inquirer.Separator('-- Simple Examples --'),
    'using-reducers',
    'using-routes',
    'using-custom-elements',
    'using-everything',
    new inquirer.Separator('-- Tiny Apps --'),
    'todo-app'
  ]
}

inquirer.prompt([question])
.then((answer) => {
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

  const compiler = Webpack(webpackConfig)
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

  server.listen(port, '127.0.0.1', () => {
    console.log(`Running ${answer.example} on http://localhost:${port}`)
  })
})
