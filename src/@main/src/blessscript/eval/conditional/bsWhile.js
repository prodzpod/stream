// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, selectExpression, skipUntil, stepOut, toBool, stepIn } = require("../bsEvalUtil");

// int
module.exports.priority = 102;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "while");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => {
    // while (...) {}
    let amt1 = skipUntil(")", index + 1, tokens, offset) + 1;
    return selectExpression(currentToken, index + amt1, tokens, offset, stack) + amt1;
}
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let idx = skipUntil(")", index + 1, tokens, offset) + 1;
    let lvalue = currentTokens.slice(2, idx - 1);
    let rvalue = currentTokens.slice(idx);
    return [[new Token(TYPE.operator, "whileLATE"), new Token(TYPE.function, {args: {}, fn: lvalue}), new Token(TYPE.function, {args: {}, fn: rvalue})]];
}
module.exports.preventUnboxing = true;