// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, NULL } = require("../../bsUtil");
const { transformIfType, selectExpression, skipUntil, stepOut, toBool, stepIn, splitTokens } = require("../bsEvalUtil");

// int
module.exports.priority = -99;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "return");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => index === tokens.length - 1 ? 1 : 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    stack.specialFlow = currentTokens[1] ?? NULL;
    return [[], stack];
}