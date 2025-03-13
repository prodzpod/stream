// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = 10;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "UNARY+");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let n = transformIfType(currentTokens, 
        [[null, TYPE.number], (_, a) => a],
        [[null, TYPE.string], (_, a) => numberish(a)],
        [[null, TYPE.bool], (_, a) => a === true ? 1 : 0],
        [[null, TYPE.list], (_, a) => a.length],
    ); if (n?.type === TYPE.error || realtype(n) !== "number") return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}