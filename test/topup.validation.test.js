process.env.NODE_ENV = "test"

const request = require("supertest")
const createJWKSMock = require("mock-jwks").default
const moment = require("moment")

describe("topup validation", () => {
	let server,
		jwksMock = createJWKSMock("https://mueve-testing.eu.auth0.com"),
		accessToken

	beforeEach(() => {
		delete require.cache[require.resolve("../server")]
		server = require("../server")
		jwksMock.start()
		accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5b911db05680670f04ef2988",
			scope: ["create:topup", "read:topups", "read:topups-won", "read:topups-toppedUp"]
		})
	})

	afterEach(async () => {
		await server.close()
		await jwksMock.stop()
	})

	it("validates limit on GET /", async function () {
		return request(server)
			.get("/")
			.query({ limit: "hola" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates startDate on GET /", async function () {
		return request(server)
			.get("/")
			.query({ startDate: "hola" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates endDate on GET /", async function () {
		return request(server)
			.get("/")
			.query({ endDate: "hola" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates startDate comes first on GET /", async function () {
		return request(server)
			.get("/")
			.query({ startDate: moment().format(), endDate: moment().subtract(1, "day").format() })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates page on GET /", async function () {
		return request(server)
			.get("/")
			.query({ page: "f" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates provider on GET /", async function () {
		return request(server)
			.get("/")
			.query({ provider: "f" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates operation on GET /stats/topups", async function () {
		return request(server)
			.get("/stats/topups")
			.query({ operation: "pro" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates startDate on GET /howMuchWon", async function () {
		return request(server)
			.get("/stats/howMuchWon")
			.query({ startDate: "f" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates endDate on GET /howMuchWon", async function () {
		return request(server)
			.get("/stats/howMuchWon")
			.query({ endDate: "f" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates provider on GET /toppedUp", async function () {
		return request(server)
			.get("/stats/toppedUp")
			.query({ provider: "movr" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates startDate on GET /toppedUp", async function () {
		return request(server)
			.get("/stats/toppedUp")
			.query({ startDate: "movr" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})

	it("validates endDate on GET /toppedUp", async function () {
		return request(server)
			.get("/stats/toppedUp")
			.query({ endDate: "movr" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect(422)
	})




})

