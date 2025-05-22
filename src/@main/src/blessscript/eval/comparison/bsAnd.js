// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, toBool, stepIn, stepOut } = require("../bsEvalUtil");

// int
module.exports.priority = -12;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "&&LATE");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (toBool(currentTokens[0])) {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack = stepIn(stack); 
        let res = await src().bsEval.eval(currentTokens[2].value.fn, stack);
        return [[new Token(TYPE.bool, toBool(res[0]))], stepOut(res[1])];
    }
    return [[new Token(TYPE.bool, false)], stack];
}