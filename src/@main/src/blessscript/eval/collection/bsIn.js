// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = -9;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "in");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let n = await transformIfType(currentTokens, 
        [[null, null, TYPE.list], (a, _, b) => b.some(x => x.is(currentTokens[0]))],
        [[TYPE.string, null, TYPE.string], (a, _, b) => b.includes(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.bool, n)], stack];
}