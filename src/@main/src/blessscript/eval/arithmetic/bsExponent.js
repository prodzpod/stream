// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = 2;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "**");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let n = transformIfType(currentTokens, 
        [[[TYPE.number, TYPE.bool], null, [TYPE.number, TYPE.bool]], (a, _, b) => Math.pow(a, b)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    if (Number.isNaN(n)) return [[new Token(TYPE.error, "illegal arithmetic was done")], stack];
    return [[new Token(TYPE.number, n)], stack];
}