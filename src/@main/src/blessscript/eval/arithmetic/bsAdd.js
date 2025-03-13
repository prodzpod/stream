// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = 0;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "+");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let n = transformIfType(currentTokens, 
        [[TYPE.null, null, TYPE.null], (a, _, b) => [TYPE.null, null]],
        [[[TYPE.null, TYPE.bool], null, [TYPE.null, TYPE.bool]], (a, _, b) => [TYPE.bool, a || b]],
        [[[TYPE.null, TYPE.number, TYPE.bool], null, [TYPE.null, TYPE.number, TYPE.bool]], (a, _, b) => [TYPE.number, a + b]],
        [[TYPE.string, null, TYPE.null], (a, _, b) => [TYPE.string, a]],
        [[TYPE.null, null, TYPE.string], (a, _, b) => [TYPE.string, b]],
        [[[TYPE.number, TYPE.string], null, [TYPE.number, TYPE.string]], (a, _, b) => [TYPE.string, a + b]],
        [[TYPE.list, null, null], (a, _, b) => [TYPE.list, [...a, currentTokens[2]]]],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(...n)], stack];
}