const { checkDates, checkPagination, checkOperadoraAsQuery } = require("./helpers")

module.exports = [
	...checkPagination, ...checkDates, checkOperadoraAsQuery
]