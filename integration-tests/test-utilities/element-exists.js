const chalk = require('chalk')

module.exports = (elementExists, elementName, results) => {
	if (elementExists) {
		results.push({type: 'pass', message: chalk.green(`✔ ${elementName} was found on the page`)})
	}

	if (!elementExists) {
		results.push({type: 'error', message: chalk.red(`✘ ${elementName} was not found on the page`)})
	}
}
