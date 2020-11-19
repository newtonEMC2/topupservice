if (process.env.NODE_ENV !== "production") {
	require("dotenv").config()
} else {
	require("@google-cloud/trace-agent").start({
		keyFilename: "/run/secrets/stackdriver-trace",
		ignoreUrls: ["/healthz"],
		serviceContext: {
			service: "topup-public"
		}
	})
}

const express = require("express"),
	secret = require("./server/services/secret"),
	bodyParser = require("body-parser"),
	cors = require("cors"),
	mongoose = require("mongoose"),
	logger = require("morgan"),
	helmet = require("helmet")
let dbUrl = secret.get("topup-public", "DB_URL") || process.env.DB_URL,
	dbName = secret.get("topup-public", "DB_NAME") || process.env.DB_NAME,
	PORT = parseInt(secret.get("topup-public", "PORT") || process.env.PORT, 10) || 7040

if (process.env.NODE_ENV === "test") {
	PORT = process.env.TEST_PORT
}

if (mongoose.connection.readyState === 0) {
	mongoose.connect(dbUrl, {
		dbName, useNewUrlParser: true, keepAlive: true,
		keepAliveInitialDelay: 300000, useUnifiedTopology: true, useCreateIndex: true
	}, error => {
		if (error) throw error
    else console.log("Mongo DB connected") /* eslint-disable-line */
	})
}

const server = express(),
	routes = require("./server/routes")

server.use(helmet())
server.use(cors())
server.use(logger("dev"))
server.use(bodyParser.json())
process.env.NODE_ENV !== "test" ? require("morgan-body")(server) : null
server.use("/", routes)

const serverObj = server.listen(PORT, () => { console.log("Server listening in PORT ", PORT) }) /* eslint-disable-line */

module.exports = serverObj
