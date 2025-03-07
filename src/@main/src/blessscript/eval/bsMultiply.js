// *priority for precents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../common");
const { TYPE, Token } = require("../bsUtil");

// int
module.exports.priority = 1;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "*");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let res = new Token(TYPE.error, "*: invalid type");
    if (currentTokens[2].type === TYPE.number) switch (currentTokens[0].type) {
        case TYPE.number: res = new Token(TYPE.number, currentTokens[0].value * currentTokens[2].value); break;
        case TYPE.string: res = new Token(TYPE.string, currentTokens[0].value.repeat(currentTokens[2].value)); break;
    }
    return [[res], stack];
}