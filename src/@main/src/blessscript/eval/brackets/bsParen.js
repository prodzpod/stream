// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, stepIn, stepOut, unbox } = require("../bsEvalUtil");

// int
module.exports.priority = 100;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => {
    if (!currentToken.is(TYPE.bracket, "(")) return false;
    if (index === 0) return true;
    if (tokens[index - 1].type === TYPE.function) return false;
    if (tokens[index - 1].type === TYPE.symbol || unbox([tokens[index - 1]], stack)[0].type === TYPE.function) return false;
    if (tokens[index - 1].is(TYPE.bracket, "]")) return false; // handle in late
    if (tokens[index - 1].is(TYPE.bracket, ")")) return false; // handle in late
    return true;
}
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, ")"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    stack.fuel -= 1;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    stack.isReturnValue = false;
    let res = await src().bsEval.eval(currentTokens.slice(1, -1), stack);
    return [[res[0]], res[1]];
}
module.exports.preventUnboxing = true;