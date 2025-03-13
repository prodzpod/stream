// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { WASD } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, toBool, unbox } = require("../bsEvalUtil");

// int
module.exports.priority = -100;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "|=");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens[0].type !== "symbol") return [[new Token(TYPE.error, WASD.pack(currentTokens[0]) + ": is not lvalue")], stack];
    let res = require("../bitwise/bsBitwiseOr").result([unbox([currentTokens[0]], stack)[0], currentTokens[1], unbox([currentTokens[2]], stack)[0]], index, tokens, offset, amount, stack);
    if (res instanceof Promise) res = await res;
    stack = res[1]; stack.var[currentTokens[0].value] = res[0][0];
    return [[stack.var[currentTokens[0].value]], stack];
}
module.exports.preventUnboxing = true;