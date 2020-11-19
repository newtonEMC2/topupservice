const { checkDates, checkOperadoraAsQuery } = require("./helpers")

module.exports = [
	...checkDates, checkOperadoraAsQuery
]

