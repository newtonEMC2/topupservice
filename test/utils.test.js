const uuid = require('../server/utils/uuid')
const assert = require('assert')

describe('generate uuid from utils', function () {

    let uuidcreated

    it('generates uuid of length 20', function () {
        uuidcreated = uuid('45')
        assert.equal(uuidcreated.length, 20)
    })
    it('generates uuid with 4 leading 0s', function () {
        uuidcreated = uuid('5')
        assert.equal(uuidcreated.substring(0, 4), '0000')
        assert.equal(uuidcreated.length, 20)
    })
    it('throws error when idPV param passed on length is 0', function () {
        assert.throws(() => uuid(''))
    })
    it('throws error when idPV param passed is greater than 5', function () {
        assert.throws(() => uuid('5tg65445'))
    })
    it('throws when idPV param passed on is not string', function () {
        assert.throws(() => uuid(8))
    })


})
