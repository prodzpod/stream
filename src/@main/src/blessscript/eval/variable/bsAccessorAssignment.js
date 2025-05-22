// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { WASD } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, toBool, unbox, assign, stepIn, stepOut } = require("../bsEvalUtil");

// int
module.exports.priority = 22;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.type === TYPE.operator && currentToken.value.endsWith("=") && index > 0 && tokens[index - 1].is(TYPE.bracket, "]");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = (currentToken, index, tokens, stack) => {
    let bracketLevel = 0;
    for (let i = index - 1; i >= 0; i--) {
        if (tokens[i].is(TYPE.bracket, "(") || tokens[i].is(TYPE.bracket, "{")) bracketLevel -= 1;
        if (tokens[i].is(TYPE.bracket, ")") || tokens[i].is(TYPE.bracket, "}")) bracketLevel += 1;
        if (tokens[i].is(TYPE.bracket, "[") && bracketLevel <= 0) return i - index;
    }
    return -index;
}
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => 1 - offset;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    stack.isReturnValue = true;
    stack = stepIn(stack); 
    let res = await src().bsEval.eval(currentTokens.slice(1, -2), stack);
    stack = stepOut(res[1]);
    if (res[0].type !== TYPE.number && res[0].type !== TYPE.string) return [[new Token(TYPE.error, "index is not number or string: " + res[0])], stack];
    currentTokens.at(-1).index ??= [];
    currentTokens.at(-1).index.splice(0, 0, res[0].value);
    return [[currentTokens.at(-1)], stack];
}
module.exports.preventUnboxing = true;