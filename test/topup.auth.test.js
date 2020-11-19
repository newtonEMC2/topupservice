process.env.NODE_ENV = "test"

const request = require("supertest"),
	createJWKSMock = require("mock-jwks").default


describe("Auth in topup Service", function () {
	let server,
		jwksMock = createJWKSMock("https://mueve-testing.eu.auth0.com")


	beforeEach(() => {
		delete require.cache[require.resolve("../server")]
		server = require("../server")
	})

	afterEach(async () => {
		await server.close()
		await jwksMock.stop()
	})

	it("fails on an unauthorized request on GET /", function (done) {
		request(server)
			.get("/")
			.set("Content-Type", "application/json")
			.expect(401, done)
	})

	it("fails on an unauthorized request on GET /stats/topups", function (done) {
		request(server)
			.get("/stats/topups")
			.set("Content-Type", "application/json")
			.expect(401, done)
	})

	it("fails with insufficient scopes request at GET /stats/topups", (done) => {
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5d5a828681f6780d6d680a93",
			scope: ""
		})
		request(server)
			.get("/stats/topups")
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "text/html; charset=utf-8")
			.expect(403, done)
	})

	it("fails on an unauthorized request on GET /balance", function (done) {
		request(server)
			.get("/balance")
			.set("Content-Type", "application/json")
			.expect(401, done)
	})

	it("fails on an unauthorized request on GET /howMuchWon", function (done) {
		request(server)
			.get("/stats/howMuchWon")
			.set("Content-Type", "application/json")
			.expect(401, done)
	})

	it("fails with insufficient scopes request at GET /howMuchWon", (done) => {
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5d5a828681f6780d6d680a93",
			scope: ""
		})
		request(server)
			.get("/stats/howMuchWon")
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "text/html; charset=utf-8")
			.expect(403, done)
	})

	it("fails on an unauthorized request on GET /toppedUp", function (done) {
		request(server)
			.get("/stats/toppedUp")
			.set("Content-Type", "application/json")
			.expect(401, done)
	})

	it("fails with insufficient scopes request at GET /toppedUp", (done) => {
		jwksMock.start()
		const accessToken = jwksMock.token({
			aud: "test",
			iss: "master",
			sub: "auth0|5d5a828681f6780d6d680a93",
			scope: ""
		})
		request(server)
			.get("/stats/toppedUp")
			.set("Accept", "application/json")
			.set({ "Authorization": "Bearer " + accessToken })
			.expect("Content-Type", "text/html; charset=utf-8")
			.expect(403, done)
	})


})