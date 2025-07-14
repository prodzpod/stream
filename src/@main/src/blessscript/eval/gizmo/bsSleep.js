// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, MAX_FUEL } = require("../../bsUtil");
const { transformIfType, toString } = require("../bsEvalUtil");

// int
module.exports.priority = -99;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "sleep");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let n = await transformIfType(currentTokens, 
        [[null, TYPE.number], (_, a) => new Promise(resolve => setTimeout(resolve, a * 1000))],
    ); if (n?.type === TYPE.error) return [[n], stack];
    await n;
    stack.fuel = Math.max(stack.fuel + n * 1000, MAX_FUEL);
    return [[currentTokens[1]], stack];
}