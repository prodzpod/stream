// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, selectExpression } = require("../bsEvalUtil");

// int
module.exports.priority = 102;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "??");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => selectExpression(currentToken, index + 1, tokens, offset, stack) + 1;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    return [[new Token(TYPE.operator, "??LATE"), new Token(TYPE.function, { args: [], fn: currentTokens.slice(1) })], stack];
}
module.exports.preventUnboxing = true;