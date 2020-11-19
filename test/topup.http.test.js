const request = require("supertest")
const createJWKSMock = require("mock-jwks").default
const Topup = require("../server/models/Topup")
const { createTopup } = require("./helpers")
const moment = require("moment")

process.env.NODE_ENV = "test"

describe("Mueve Base tests", () => {
	let server,
		jwksMock = createJWKSMock("https://mueve-testing.eu.auth0.com")

	beforeEach(async () => {
		delete require.cache[require.resolve("../server")]
		server = require("../server")
	})

	afterEach(async () => {
		await server.close()
		await jwksMock.stop()
		await Topup.deleteMany({})
	})

	it("get limited topup objects on GET /", async function () {
		await Promise.all([
			createTopup(), createTopup(), createTopup(), createTopup()
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups"
		})
		return request(server)
			.get("/")
			.query({ limit: 2 })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (!body.success) throw new Error("couldt get topups limited") })
			.expect(({ body }) => { if (body.totalDocs !== 4) throw new Error("couldt get topups limited") })
			.expect(({ body }) => { if (body.docs.length !== 2) throw new Error("couldt get topups limited") })
			.expect(200)
	})

	it("get topup objects filtered by date on GET /", async function () {
		await Promise.all([
			createTopup(), createTopup(), createTopup(), createTopup()
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups"
		})
		return request(server)
			.get("/")
			.query({ startDate: moment().add(1, "day").format() })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (!body.success) throw new Error("couldt get topups by date") })
			.expect(({ body }) => { if (body.totalDocs !== 0) throw new Error("couldt get topups by date") })
			.expect(200)
	})

	it("get topup objects filtered by provider on GET /", async function () {
		await Promise.all([
			createTopup(), createTopup(), createTopup(), createTopup({ provider: "digitel" })
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups"
		})
		return request(server)
			.get("/")
			.query({ provider: "digitel" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (!body.success) throw new Error("couldt get topups by date") })
			.expect(({ body }) => { if (body.totalDocs !== 1) throw new Error("couldt get topups by date") })
			.expect(({ body }) => { if (body.docs.length !== 1) throw new Error("couldt get topups by date") })
			.expect(200)
	})

	it("get topup sorted by provider on GET /stats/topups", async function () {
		await Promise.all([
			createTopup(), createTopup(), createTopup(), createTopup({ provider: "digitel" })
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups"
		})
		return request(server)
			.get("/stats/topups")
			.query({ operation: "provider" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (!body.success) throw new Error("couldt get topups by date") })
			// .expect(({ body }) => { if (body.totalDocs !== 1) throw new Error("couldt get topups by date") })
			// .expect(({ body }) => { if (body.docs.length !== 1) throw new Error("couldt get topups by date") })
			.expect(200)
	})

	it("checks out phone balance on GET /balance", async function () {
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:mueve-balance"
		})
		return request(server)
			.get("/balance")
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (!body.data.saldo_disponible) throw new Error("check balance not successful") })
			.expect(200)
	})

	it("checks out how much won on fees on GET /howMuchWon", async function () {
		await Promise.all([
			createTopup(), createTopup(), createTopup({ amount: 3000 }), createTopup()
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups-won"
		})
		return request(server)
			.get("/stats/howMuchWon")
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (body.data.totalWon != 300) throw new Error("total won does not match up") })
			.expect(200)
	})

	it("checks out how much won on fees filtered by date on GET /howMuchWon", async function () {
		await Promise.all([
			createTopup(), createTopup({ status: "pending" }), createTopup({ status: "approved", amount: 3000 }), createTopup({ status: "approved" })
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups-won"
		})
		return request(server)
			.get("/stats/howMuchWon")
			.query({ startDate: moment().add(1, "day").format() })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (body.data.totalWon) throw new Error("total won does not match up") })
			.expect(200)
	})

	it("checks out how much amout has been topped up on GET /toppedUp", async function () {
		await Promise.all([
			createTopup(),
			createTopup({ amount: 3000 }),
			createTopup({ provider: "digitel" })
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups-toppedUp"
		})
		return request(server)
			.get("/stats/toppedUp")
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (body.data.toppedUp != 5000) throw new Error("total topped up does not match up") })
			.expect(200)
	})

	it("checks out how much amout has been topped up filtered by provider on GET /toppedUp", async function () {
		await Promise.all([
			createTopup(),
			createTopup({ amount: 3000 }),
			createTopup({ provider: "digitel" })
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups-toppedUp"
		})
		return request(server)
			.get("/stats/toppedUp")
			.query({ provider: "digitel" })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (body.data.toppedUp != 1000) throw new Error("total topped up does not match up") })
			.expect(200)
	})

	it("checks out how much amout has been topped up filtered by date on GET /toppedUp", async function () {
		await Promise.all([
			createTopup(),
			createTopup({ amount: 3000 }),
			createTopup({ provider: "digitel" })
		])
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5dd79dfdd782d20d2b03d237",
			scope: "read:topups-toppedUp"
		})
		return request(server)
			.get("/stats/toppedUp")
			.query({ startDate: moment().add(1, "day").format() })
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "application/json; charset=utf-8")
			.expect(({ body }) => { if (body.data.toppedUp) throw new Error("total topped up does not match up") })
			.expect(200)
	})

})

