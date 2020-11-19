const Topup = require("../server/models/Topup")
const uuid = require("../server/utils/uuid")
/**
 * Creates a Topup in DB
 * @param {Object} user 
 */
const createTopup = async (topup) => {
	let topupObj = {
		userId: "auth0|5e21a4569b3dda0cbb4650e1",
		uuid: uuid(Math.floor(Math.random() * 1000).toString()),
		phoneNumber: "04141234567",
		amount: 1000,
		provider: "movistar",
		walletName: "VES",
		productCode: "movil",
		creationDate: Date.now()
	}

	const newTopup = { ...topupObj, ...topup }
	return await Topup.create(newTopup)
}






module.exports = {
	createTopup,

}