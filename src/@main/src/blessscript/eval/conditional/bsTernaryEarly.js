// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, toBool, splitTokens, selectExpression } = require("../bsEvalUtil");

// int
module.exports.priority = 102;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "?");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => {
    let amt1 = skipUntil(new Token(TYPE.operator, ":"), index, tokens);
    return selectExpression(currentToken, index + amt1, tokens, offset, stack) + amt1;
}
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let [lvalue, rvalue] = splitTokens(currentTokens.slice(1), new Token(TYPE.operator, ":"));
    return [[new Token(TYPE.operator, "?LATE"), new Token(TYPE.function, { args: [], fn: lvalue }), new Token(TYPE.operator, ":"), new Token(TYPE.function, { args: [], fn: rvalue })], stack];
}
module.exports.preventUnboxing = true;