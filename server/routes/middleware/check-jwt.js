const jwt = require("express-jwt")
const jwksRsa = require("jwks-rsa")
const secret = require("../../services/secret")
var checkJwt

if (process.env.NODE_ENV === "test") {

	checkJwt = jwt({
		secret: jwksRsa.expressJwtSecret({
			cache: false,
			jwksUri: "https://mueve-testing.eu.auth0.com/.well-known/jwks.json"
		}),
		// Validate the audience and the issuer.
		audience: "test",
		issuer: "master",
		algorithms: ["RS256"]
	})

} else {

	checkJwt = jwt({
		secret: jwksRsa.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: secret.get("topup-public", "OAUTH_JWKS") || process.env.OAUTH_JWKS
		}),
		// Validate the audience and the issuer.
		audience: secret.get("topup-public", "OAUTH_AUDIENCE") || process.env.OAUTH_AUDIENCE,
		issuer: secret.get("topup-public", "OAUTH_ISSUER") || process.env.OAUTH_ISSUER,
		algorithms: ["RS256"]
	})

}

module.exports = checkJwt
