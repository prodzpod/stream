// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype, WASD } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, NULL } = require("../../bsUtil");
const { transformIfType, selectExpression, skipUntil, stepOut, toBool, stepIn, copyFunction } = require("../bsEvalUtil");

// int
module.exports.priority = 21;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "whileLATE");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let lastResult = NULL;
    while (true) {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack.isReturnValue = true;
        stack = stepIn(stack); 
        let res = await src().bsEval.eval(copyFunction(currentTokens[1].value), stack);
        stack = stepOut(res[1]);
        if (toBool(res[0])) {
            stack.isReturnValue = false;
            stack = stepIn(stack); 
            let res = await src().bsEval.eval(copyFunction(currentTokens[2].value), stack);
            stack = stepOut(res[1]);
            lastResult = res[0];
            if (stack.specialFlow?.is(TYPE.operator, "break")) {
                delete stack.specialFlow;
                return [[lastResult], stack];
            }
            else if (stack.specialFlow?.is(TYPE.operator, "continue")) delete stack.specialFlow;
            else if (stack.specialFlow) return [[lastResult], stack];
        } else return [[lastResult], stack];
    }
}
module.exports.preventUnboxing = true;