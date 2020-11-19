
/**
 * The first 5 positions stand for idPV. If shorter than 5, then add leading 0. 
 * It follows by '_'
 * Then follows 14 chars, which are a timestamp. If timestamp shorter than 16, add leading 0
 * 
 * format:  [xxxxx_xxxxxxxxxxxxxx]
 * example: [01234_01751776520726] //always length 20
 * 
 * @param {String} idPV    - shop number id. Id del punto de venta
 * @returns {String} - Creates and returns an uuid to track down the topup when needed
 */
const uuid = (idPV) => {
    try {
        let uuid
        let timestamp = _shiftRandomNum(Date.now().toString())

        if (typeof idPV !== 'string') throw new Error('idPV has to be an string')
        if (idPV.length > 5 || idPV.length <= 0) throw new Error('idPV should be between 5 an 1 both included')

        uuid = idPV.length !== 5 ? _addLeading0(idPV, 5) : idPV
        uuid += '_'
        uuid += timestamp.toString().length < 14 ? _addLeading0(timestamp, 14) : timestamp

        return uuid
    } catch (e) {
        throw new Error(e)
    }
}

/**
 * Pass it on a timestamp and will change the first three numbers with a random number
 * ranging from 0 to 999 (both included)
 * @param {String} timestamp - timestamp
 * @returns {String}    - return the item with leading 0's
 */
const _shiftRandomNum = (timestamp) => {
    const randomNum = Math.floor(Math.random() * 1000)
    return randomNum + timestamp.substring(3)
}

/**
 * Adds leading 0's to the item passed on and returns it
 * @param {String} item           - string which we want to place leading 0's
 * @param {Number} lengthExpected - Size of the item we want to return
 * @returns {String}              - return the item with leading 0's
 */
const _addLeading0 = (item, lengthExpected) => {
    if (item.length >= lengthExpected) return item
    var leading0 = ''
    while (leading0.length < lengthExpected - item.length) leading0 = "0" + leading0;
    return leading0 + item
}

module.exports = uuid

