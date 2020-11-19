const Auth = () => {
	let accessToken
	let businessToken
	const request = require("request-promise-native")
	const jwt = require("jsonwebtoken")
	const moment = require("moment")
	const secret = require("./secret")
	
	/**
	 * Returns a new access token
	 */
	const getToken = async () => {
		if (!accessToken) {
			try {
				accessToken = await loadToken() /* eslint-disable-line */
				return accessToken
			} catch (e) {
				throw new Error("Unable to load token")
			}
		} else {
			let decodedToken = jwt.decode(accessToken)
			let expirationDate = moment.unix(decodedToken.exp)
			let today = moment()
			if (today.isSameOrAfter(expirationDate)) {
				try {
					accessToken = await loadToken() /* eslint-disable-line */
					return accessToken
				} catch (e) {
					throw new Error("Unable to load token")
				}
			} else {
				return accessToken
			}
		}
	}

	/**
	 * Loads a new access token from auth0
	 * servers
	 */
	const loadToken = async () => {
		const credentialsBody = {
			"client_id": secret.get("topup-public", "OAUTH_CLIENT_ID") || process.env.OAUTH_CLIENT_ID,
			"client_secret": secret.get("topup-public", "OAUTH_CLIENT_SECRET") || process.env.OAUTH_CLIENT_SECRET,
			"audience": secret.get("topup-public", "OAUTH_AUDIENCE") || process.env.OAUTH_AUDIENCE,
			"grant_type": "client_credentials"
		}
		console.log("Loading token from AUTH0") /* eslint-disable-line */
		try {
			const authResponse = await request.post(
				secret.get("topup-public", "OAUTH_URL") || process.env.OAUTH_URL,
				{
					body: credentialsBody,
					json: true
				}
			)
			return authResponse.access_token
		} catch (e) {
			throw new Error("Unable to fetch token from auth0")
		}
	}


	/**
	 * Loads a new business API token
	 */
	const loadBusinessToken = async () => {
		const credentialsBody = {
			"client_id": secret.get("topup-public", "OAUTH_CLIENT_ID") || process.env.OAUTH_CLIENT_ID,
			"client_secret": secret.get("topup-public", "OAUTH_CLIENT_SECRET") || process.env.OAUTH_CLIENT_SECRET,
			"audience": secret.get("topup-public", "OAUTH_BUSINESS_AUDIENCE") || process.env.OAUTH_BUSINESS_AUDIENCE,
			"grant_type": "client_credentials"
		}
		console.log("Loading business token from AUTH0") /* eslint-disable-line */
		try {
			const authResponse = await request.post(
				secret.get("topup-public", "OAUTH_URL") || process.env.OAUTH_URL,
				{
					body: credentialsBody,
					json: true
				}
			)
			return authResponse.access_token
		} catch (e) {
			throw new Error(e)
		}
	}

	/**
	 * Returns a new access token
	 * for the business APIs
	 */
	const getBusinessToken = async () => {
		if (!businessToken) {
			try {
				businessToken = await loadBusinessToken() /* eslint-disable-line */
				return businessToken
			} catch (e) {
				console.log(e)
				throw new Error("Unable to load token")
			}
		} else {
			let decodedToken = jwt.decode(businessToken)
			let expirationDate = moment.unix(decodedToken.exp)
			let today = moment()
			if (today.isSameOrAfter(expirationDate)) {
				try {
					businessToken = await loadBusinessToken() /* eslint-disable-line */
					return businessToken
				} catch (e) {
					throw new Error("Unable to load token")
				}
			} else {
				return businessToken
			}
		}
	}
	return {
		getToken,
		getBusinessToken
	}
}

module.exports = Auth()