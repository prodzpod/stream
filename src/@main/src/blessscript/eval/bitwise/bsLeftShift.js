// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype, Math } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, subSort } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = -1;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "<<");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let n = await transformIfType(currentTokens, 
        [[[TYPE.number, TYPE.bool, TYPE.null], null, [TYPE.number, TYPE.null]], (a, _, b) => [TYPE.number, Math.floor(a * Math.pow(2, b))]],
        [[TYPE.list, null, [TYPE.number, TYPE.null]], (a, _, b) => [TYPE.list, [...a.slice(Math.posmod(b, a.length), a.length), ...a.slice(0, Math.posmod(b, a.length))]]],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(...n)], stack];
}