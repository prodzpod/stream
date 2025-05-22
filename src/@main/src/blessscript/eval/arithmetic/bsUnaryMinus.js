// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = 10;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "UNARY-");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens[1].type === TYPE.list) 
        return [[new Token(TYPE.list, currentTokens[1].value.reverse())], stack];
    let n = await transformIfType(currentTokens, 
        [[null, TYPE.number], (_, a) => [TYPE.number, -a]],
        [[null, TYPE.string], (_, a) => [TYPE.string, a.split("").reverse().join("")]],
        [[null, TYPE.list], (_, a) => [TYPE.list, a.reverse()]],
        [[null, TYPE.bool], (_, a) => [TYPE.bool, !a]],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(...n)], stack];
}