const mongoose = require("mongoose"),
	paginate = require("mongoose-paginate-v2"),
	Schema = mongoose.Schema

const topupSchema = new Schema({
	userId: { type: String, required: true },
	uuid: { type: String, required: true, unique: true },
	phoneNumber: { type: String, required: true },
	amount: { type: Number, required: true },
	provider: { type: String, required: true }, //movistar, digitel ...
	walletName: { type: String, required: true },
	productCode: { type: String, required: true }, // 01, 26 ... 
	fee: { type: Number, default: 5 },
	creationDate: { type: Date, default: Date.now }
})

topupSchema.plugin(paginate)
const Topup = mongoose.model("Topup", topupSchema)

module.exports = Topup


