// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, toString } = require("../bsEvalUtil");

// int
module.exports.priority = 1;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "*");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let n = await transformIfType(currentTokens, 
        [[[TYPE.bool, TYPE.null], null, [TYPE.bool, TYPE.null]], (a, _, b) => [TYPE.bool, a && b]],
        [[[TYPE.number, TYPE.bool, TYPE.null], null, [TYPE.number, TYPE.bool, TYPE.null]], (a, _, b) => [TYPE.number, a * b]],
        [[TYPE.string, null, [TYPE.number, TYPE.null]], (a, _, b) => [TYPE.string, b >= 0 ? a.repeat(b) : a.split("").reverse().join("").repeat(-b)]],
        [[TYPE.list, null, TYPE.null], (a, _, b) => [TYPE.list, []]],
        [[TYPE.list, null, TYPE.number], (a, _, b) => [TYPE.list, b >= 0 ? Array(b).fill(a).flat() : Array(-b).fill(a.reverse()).flat()]],
        [[TYPE.list, null, TYPE.string], (a, _, b) => [TYPE.string, a.map(x => toString(x)).join(b)]],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(...n)], stack];
}