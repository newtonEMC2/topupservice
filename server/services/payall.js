const PayallService = () => {
	const request = require("request-promise")
	const Auth = require("./auth")
	const secret = require("./secret")
	const externalServiceUrl = secret.get("topup", "ADAM_SERVICE_URL") || process.env.ADAM_SERVICE_URL


	/**
     * Checks mueve balance with payall 
     */
	const checkMueveBalance = async () => {
		try {
			const accessToken = await Auth.getBusinessToken()
			return await request.get(`${externalServiceUrl}balance`, { auth: { bearer: accessToken }, json: true, strictSSL: false })
		} catch (e) { throw new Error("Unexpected error when retrieving mueve's balance on payall") }
	}

	return { checkMueveBalance }
}


module.exports = PayallService
