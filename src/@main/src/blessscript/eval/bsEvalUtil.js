const { log } = require("../../../commonServer");
const { TYPE } = require("../bsUtil");

module.exports.skipUntil = (target, index, tokens, offset) => {
    let bracketLevel = 0;
    for (let i = index + 1; i < tokens.length; i++) {
        if (tokens[i].is(TYPE.bracket, "(") || tokens[i].is(TYPE.bracket, "{")) bracketLevel += 1;
        if (tokens[i].is(TYPE.bracket, ")") || tokens[i].is(TYPE.bracket, "}")) bracketLevel -= 1;
        if (tokens[i].is(target) && bracketLevel <= 0) return i - index + 1 - offset;
    }
    return tokens.length - index + 1 - offset;
}