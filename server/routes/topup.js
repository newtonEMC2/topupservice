const router = require("express").Router()
const TopUpFactory = require("../handlers/topup")()

const checkJwt = require("./middleware/check-jwt")
const jwtAuthz = require("express-jwt-authz")
const validationManager = require("./middleware/validation")

const allTopupValidator = require("./validators/all.topup")
const getWon = require("./validators/get.won")
const getToppedUp = require("./validators/get.toppedUp")
const getStatsTopups = require("./validators/get.statsTopups")


// checks out the current balance on a phone
router.get("/balance", checkJwt, jwtAuthz(["read:mueve-balance"]), TopUpFactory.phoneBalanceEnquiry)
// how much won in commision by mueve
router.get("/stats/howMuchWon", checkJwt, jwtAuthz(["read:topups-won"]), getWon, validationManager, TopUpFactory.howMuchWonStats)
// gets amount topped up in a range of Date
router.get("/stats/toppedUp", checkJwt, jwtAuthz(["read:topups-toppedUp"]), getToppedUp, validationManager, TopUpFactory.toppedUpStats)
// get all topups as a whole, classified by a specific param
router.get("/stats/topups", checkJwt, jwtAuthz(["read:topups"]), getStatsTopups, validationManager, TopUpFactory.topupStats)
// gets all topups filtered by a params
router.get("/", checkJwt, jwtAuthz(["read:topups"]), allTopupValidator, validationManager, TopUpFactory.all)


module.exports = router
