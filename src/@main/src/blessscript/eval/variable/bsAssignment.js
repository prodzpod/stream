// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { WASD } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, toBool, unbox, assign } = require("../bsEvalUtil");

// int
module.exports.priority = -100;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "=");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens[0].type !== "symbol") return [[new Token(TYPE.error, WASD.pack(currentTokens[0]) + ": is not lvalue")], stack];
    const rvalue = unbox([currentTokens[2]], stack)[0];
    let nstack = assign(currentTokens[0].value, rvalue, stack, currentTokens[1].index); if (typeof nstack === "string") return [[new Token(TYPE.error, nstack)], stack]; stack = nstack;
    return [[rvalue], stack];
}
module.exports.preventUnboxing = true;