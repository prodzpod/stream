// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, stepIn, stepOut } = require("../bsEvalUtil");

// int
module.exports.priority = 100;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.bracket, "{")
    && ((skipUntil("}", index, tokens) < skipUntil(",", index, tokens, 0, -1)) && !tokens[index + 1]?.is(TYPE.bracket, "}"));
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, "}"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    stack.fuel -= 1;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    stack.isReturnValue = false;
    stack = stepIn(stack); 
    let res = await src().bsEval.eval(currentTokens.slice(1, -1), stack);
    return [[res[0]], stepOut(res[1])];
}
module.exports.preventUnboxing = true;