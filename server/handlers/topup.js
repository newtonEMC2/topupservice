const TopUpFactory = () => {

	const Topup = require("../models/Topup")
	const Payall = require("../services/payall")()


	/**
	 * Get topups models filtered by params
	 * @param {*} req 
	 * @param {*} res 
	 * @param {Date} req.query.startDate  - start date
	 * @param {Date} req.query.endDate    - ending date
	 * @param {Date} req.query.provider   - movistar, digitel ...
	 */
	const all = async (req, res) => {
		try {
			const { page, limit = 50, startDate, endDate, provider } = req.query
			let query = {}
			if (startDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$gte = new Date(startDate) }
			if (endDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$lte = new Date(endDate) }
			if (provider) { query.provider = provider }
			const topups = await Topup.paginate(query, { page, limit, lean: true, sort: { creationDate: -1 } })
			const { totalDocs, hasPrevPage, hasNextPage, page: _page, totalPages, docs } = topups
			return res.status(200).json({ success: true, docs, page: _page, totalDocs, totalPages, hasNextPage, hasPrevPage })
		} catch (e) { return errorHandler(res, "server error") }
	}

	const topupStats = async (req, res) => {
		const { limit, startDate, endDate, operation } = req.query
		let query = {}
		try {
			if (startDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$gte = new Date(startDate) }
			if (endDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$lte = new Date(endDate) }
			let rp = await Topup.aggregate([
				{ $match: query },
				{
					$group: {
						_id: `$${operation}`, total: { $sum: 1 }
					}
				},
			])
			if (!rp || !rp[0]) rp = []
			return res.status(200).json({ success: true, data: rp })
		} catch (e) { return errorHandler(res, "server error") }
	}

	/**
	 * checks phone balance.
	 * @param {*} req 
	 * @param {*} res 
	 * 
	 */
	const phoneBalanceEnquiry = async (req, res) => {
		try {
			const rp = await Payall.checkMueveBalance()
			return res.status(200).json({ success: true, data: rp.data })
		} catch (e) { return errorHandler(res, "Unable to check phone balance") }
	}

	/**
 	* Gets How much won by mueve on fees. 5% is applied on every transaction
	* @param {*}    req 
	* @param {*}    res
	* @param {Date} req.query.startDate  - start date
	* @param {Date} req.query.endDate    - ending date
	*/
	const howMuchWonStats = async (req, res) => {
		const { startDate, endDate } = req.query
		try {
			let query = {}
			if (startDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$gte = new Date(startDate) }
			if (endDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$lte = new Date(endDate) }
			let rp = await Topup.aggregate([
				{ $match: query },
				{
					$group: {
						_id: null, totalWon: {
							$sum: {
								$multiply: ["$amount", { $divide: ["$fee", 100] }]
							}
						}
					}
				},
				{ $project: { _id: 0 } },
			])
			if (rp && rp[0]) rp = rp[0]
			else rp = {}
			return res.status(200).json({ success: true, data: rp })
		} catch (e) { return errorHandler(res, e.message) }
	}

	/**
 	* Gets How much topped up in a range of date
	* @param {*}    req 
	* @param {*}    res
	* @param {Date} req.query.startDate  - start date
	* @param {Date} req.query.endDate    - ending date
	*/
	const toppedUpStats = async (req, res) => {
		const { startDate, endDate, provider } = req.query
		try {
			let query = {}
			if (startDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$gte = new Date(startDate) }
			if (endDate) { if (!query.creationDate) query.creationDate = {}; query.creationDate.$lte = new Date(endDate) }
			if (provider) query.provider = provider
			let rp = await Topup.aggregate([
				{ $match: query },
				{
					$group: {
						_id: null, toppedUp: {
							$sum: "$amount"
						}
					}
				},
				{ $project: { _id: 0 } },
			])
			if (rp && rp[0]) rp = rp[0]
			else rp = {}
			return res.status(200).json({ success: true, data: rp })
		} catch (e) { return errorHandler(res, e.message) }
	}

	const errorHandler = (res, message) => {
		return res.status(500).json({ error: "Internal Server Error", message })
	}

	return {
		all,
		topupStats,
		howMuchWonStats,
		toppedUpStats,
		phoneBalanceEnquiry,
	}
}

module.exports = TopUpFactory
