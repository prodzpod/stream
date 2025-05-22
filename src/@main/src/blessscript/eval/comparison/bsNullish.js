// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, stepIn, stepOut } = require("../bsEvalUtil");

// int
module.exports.priority = -13;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "??LATE");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens[0].type === TYPE.null) {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack = stepIn(stack); 
        let res = await src().bsEval.eval(currentTokens[2].value.fn, stack);
        return [[res[0]], stepOut(res[1])];
    }
    return [[currentTokens[0]], stack];
}