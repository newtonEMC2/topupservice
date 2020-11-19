const express = require("express"),
	router = express.Router(),
	mongoose = require("mongoose")

router.get("/healthz", function (req, res) {
	if (mongoose.connection.readyState === 1) {
		return res.status(200).json({ status: "OK" })
	} else {
		return res.status(500).json({ status: "MongoDB is down" })
	}
})
router.use("/", require("./topup"))

module.exports = router
