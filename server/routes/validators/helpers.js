const { query } = require("express-validator")
const moment = require("moment")

//patterns
const operadora = new RegExp(/^(movistar|movilnet|digitel)$/)
const status = new RegExp(/(approved|pending|failed)/)
const operation = new RegExp(/^(provider)$/)

// checkers
const checkOperation = query("operation").optional().matches(operation).withMessage("operation is not valid")
const checkOperadoraAsQuery = query("provider").optional().matches(operadora).withMessage("provider does not exists or not available to trade with")
const checkStatus = query("status").optional().matches(status).withMessage("invalid status")
const checkDates = [
	query("startDate").optional({ checkFalsy: false }).isISO8601({ strict: true }).withMessage("Invalid start date").trim(),
	query("endDate").optional({ checkFalsy: false }).isISO8601({ strict: true }).withMessage("Invalid endDate").trim(),
	query().custom(query => {
		if (query && query.startDate && query.endDate) return moment(query.startDate).isBefore(query.endDate)
		else return true
	}).withMessage("No date consistency")]
const checkPagination = [
	query("page").optional().isInt({ min: 0 }).toInt(),
	query("limit").optional().isInt({ min: 0, max: 99 }).toInt()
]


module.exports = {
	checkOperation,
	checkOperadoraAsQuery,
	checkStatus,
	checkDates,
	checkPagination,

}