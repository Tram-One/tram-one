const Tram = require('../../tram-one')
const app = new Tram()

app.addActions({todos: require('./actions/TodoActions')})
app.addRoute('/', require('./pages/HomePage'))
app.addRoute('/todo', require('./pages/TodoPage'))
app.addRoute('/completed', require('./pages/CompletedPage'))
app.addRoute('/results', require('./pages/ResultsPage'))

app.start('.main')
