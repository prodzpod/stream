// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { WASD } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, NULL } = require("../../bsUtil");
const { skipUntil, toBool, unbox, assign } = require("../bsEvalUtil");

// int
module.exports.priority = -99;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "let");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens[1].type !== "symbol") return [[new Token(TYPE.error, WASD.pack(currentTokens[1]) + ": is not a symbol")], stack];
    stack.var.at(-1)[currentTokens[1].value] = NULL;
    return [[currentTokens[1]], stack];
}
module.exports.preventUnboxing = true;