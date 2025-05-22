// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, toBool, stepIn, stepOut, copyFunction } = require("../bsEvalUtil");

// int
module.exports.priority = -1000;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "?LATE");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 5;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (toBool(currentTokens[0])) {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack = stepIn(stack); 
        stack.isReturnValue = true;
        let res = await src().bsEval.eval(copyFunction(currentTokens[2].value), stack);
        return [[res[0]], stepOut(res[1])];
    }
    {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack = stepIn(stack); 
        stack.isReturnValue = true;
        let res = await src().bsEval.eval(copyFunction(currentTokens[4].value), stack);
        return [[res[0]], stepOut(res[1])];
    }
}