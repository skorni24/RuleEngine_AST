const { chain, sample } = require("lodash");
const dict = require("./words-by-letter.json");

module.exports = function acro(letters) {
    return chain(letters)
        .split('')
        .map(l => dict[l])
        .map(o => sample(o))
        .value();
}
