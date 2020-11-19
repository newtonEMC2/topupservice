const { validationResult } = require("express-validator/check")

const validationManager = (req, res, next) => {
	const errors = validationResult(req)
	if (errors.array().length > 0) {
		return res.status(422).json({
			message: "Validation failed",
			errors: errors.array()
		})
	}
	next()
}

module.exports = validationManager