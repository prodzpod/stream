// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, toString, tokenize, skipUntil, splitTokens, selectExpression } = require("../bsEvalUtil");

// int
module.exports.priority = 150;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "=>");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = (currentToken, index, tokens, stack) => {
    if (index === 0) return -1; // THROW ERROR: must have smth behind
    if (tokens[index - 1].type === "symbol") return -1; // NORMAL: just eat that one
    if (tokens[index - 1].is(TYPE.bracket, ")")) {
        let bracketLevel = 0;
        for (let i = index - 1; i >= 0; i--) {
            if (tokens[i].is(TYPE.bracket, "(") || tokens[i].is(TYPE.bracket, "{")) bracketLevel -= 1;
            if (tokens[i].is(TYPE.bracket, ")") || tokens[i].is(TYPE.bracket, "}")) bracketLevel += 1;
            if (tokens[i].is(TYPE.bracket, "(") && bracketLevel <= 0) return i - index;
        }
        return -index;
    }
    return -Infinity; // THROW ERROR: invalid lvalue
}
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => selectExpression(currentToken, index + 1, tokens, offset, stack) + 1;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let idx = currentTokens.findIndex(x => x.is(TYPE.operator, "=>"));
    let args = currentTokens.slice(0, idx);
    let fn = currentTokens.slice(idx + 1);
    if (args[0].type === TYPE.bracket) args = args.slice(1, -1);
    args = splitTokens(args, new Token(TYPE.operator, ","));
    if (!args[0].length) args = [];
    else args = args.map(x => x.at(-1).value);
    return [[new Token(TYPE.function, { args: args, fn: fn })], stack];
}
module.exports.preventUnboxing = true;