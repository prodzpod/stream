// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = 1;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "/");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let n = transformIfType(currentTokens, 
        [[[TYPE.number, TYPE.bool, TYPE.null], null, [TYPE.number, TYPE.bool, TYPE.null]], (a, _, b) => [TYPE.number, a / b]],
        [[TYPE.string, null, TYPE.null], (a, _, b) => [TYPE.list, a.split("").map(x => new Token(TYPE.string, x))]],
        [[TYPE.string, null, TYPE.string], (a, _, b) => [TYPE.list, a.split(b).map(x => new Token(TYPE.string, x))]],
    ); if (n?.type === TYPE.error) return [[n], stack];
    if (Number.isNaN(n[1])) return [[new Token(TYPE.error, "illegal arithmetic was done")], stack];
    return [[new Token(...n)], stack];
}