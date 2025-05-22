// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, subSort } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = -9;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, ">");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    return [[new Token(TYPE.bool, subSort(currentTokens[0].value, currentTokens[2].value) > 0)], stack];
}