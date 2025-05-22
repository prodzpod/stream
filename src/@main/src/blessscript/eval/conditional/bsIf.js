// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, selectExpression, skipUntil } = require("../bsEvalUtil");

// int
module.exports.priority = 102;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "if");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (currentToken, index, tokens, offset, stack) => {
    // if (...) {}
    let amt1 = skipUntil(")", index + 1, tokens, offset) + 1;
    let amt2 = selectExpression(tokens[index + amt1], index + amt1, tokens, offset, stack) + amt1;
    // optionally: else ()
    if (tokens[index + amt2]?.is(new Token(TYPE.operator, "else"))) {
        if (tokens[index + amt2 + 1]?.is(new Token(TYPE.operator, "if"))) 
            return module.exports.amount(tokens[index + amt2 + 1], index + amt2 + 1, tokens, offset, stack);
        else return selectExpression(tokens[index + amt2 + 1], index + amt2 + 1, tokens, offset, stack) + amt2 + 1;
    }
    else return amt2;
}
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let idx = skipUntil(")", index + 1, tokens, offset) + 1;
    let lvalue = currentTokens.slice(2, idx - 1);
    let idx2 = selectExpression(currentTokens[0], index + idx, tokens, offset, stack) + idx;
    let rvalue = currentTokens.slice(idx, idx2);
    let evalue;
    if (currentTokens.length > idx2) evalue = currentTokens.slice(idx2 + 1);
    else evalue = [];
    return [[...lvalue, new Token(TYPE.operator, "?LATE"), new Token(TYPE.function, { args: [], fn: rvalue }), new Token(TYPE.operator, ":"), new Token(TYPE.function, { args: [], fn: evalue })], stack];
}
module.exports.preventUnboxing = true;