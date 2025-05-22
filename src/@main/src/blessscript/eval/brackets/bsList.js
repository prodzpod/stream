// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, unbox, stepOut, stepIn } = require("../bsEvalUtil");

// int
module.exports.priority = 21;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => {
    if (!currentToken.is(TYPE.bracket, "[")) return false;
    if (index === 0) return true; // different
    if (tokens[index - 1].type === TYPE.list 
        || tokens[index - 1].type === TYPE.dict
        || tokens[index - 1].type === TYPE.string) return false; // different
    if (tokens[index - 1].type === TYPE.symbol) {
        let unboxed = unbox([tokens[index - 1]], stack)[0];
        if (unboxed.type === TYPE.list 
            || unboxed.type === TYPE.dict
            || unboxed.type === TYPE.string) return false; // different
    }
    return true; // different
}
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, "]"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens.length === 2) return [[new Token(TYPE.list, [])], stack];
    stack.fuel -= 1;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    stack.isReturnValue = true;
    stack = stepIn(stack); 
    let res = await src().bsEval.eval(currentTokens.slice(1, -1), stack);
    stack = stepOut(res[1]); 
    if (stack.numReturnValues === 1) return [[new Token(TYPE.list, [res[0]])], stack];
    return [[res[0]], stack];
}
module.exports.preventUnboxing = true;