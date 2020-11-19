const fs = require("fs"),
	util = require("util")

module.exports = {
	get(secret, property) {
		try {
			const rawFile = fs.readFileSync(util.format("/run/secrets/%s", secret), "utf8")
			const json = JSON.parse(rawFile)
			return json[property].trim()
		}
		catch (e) {
			return false
		}
	}
}