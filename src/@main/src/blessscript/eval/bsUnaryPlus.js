// *priority for precents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../common");
const { TYPE, Token } = require("../bsUtil");

// int
module.exports.priority = 10;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "UNARY+");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = (currentTokens, index, tokens, offset, amount, stack) => {
    let res = new Token(TYPE.error, "unary +: invalid type");
    switch (currentTokens[1].type) {
        case TYPE.number: res = currentTokens[1]; break;
        case TYPE.string: 
            let n = numberish(currentTokens[1].value);
            if (realtype(n) === "number") res = new Token(TYPE.number, n); break;
    } 
    return [[res], stack];
}