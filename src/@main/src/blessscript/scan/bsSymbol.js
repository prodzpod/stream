const { Token, TYPE } = require("../bsUtil");
const { isWord } = require("./bsScanUtil");

// fn = (char, string, any (""), [Token], StackData) => [string || int, any, string, [Token], StackData]
module.exports.symbol = (c, string, currentToken, tokens, stack) => {
    if (isWord(c)) return [1, currentToken + c];
    return [0, "", "init", [...tokens, new Token(TYPE.symbol, currentToken)]]; 
}