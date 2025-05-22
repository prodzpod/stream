// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype, WASD } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, selectExpression, skipUntil, stepOut, toBool, stepIn, copyFunction } = require("../bsEvalUtil");

// int
module.exports.priority = 21;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "forLATE");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 5;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    stack.fuel -= 1;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    stack.isReturnValue = false;
    stack = stepIn(stack); 
    let init = await src().bsEval.eval(copyFunction(currentTokens[1].value), stack);
    let lastResult = init[0];
    stack = init[1];
    while (true) {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack.isReturnValue = true;
        stack = stepIn(stack); 
        let res = await src().bsEval.eval(copyFunction(currentTokens[2].value), stack);
        stack = stepOut(res[1]);
        if (toBool(res[0])) {
            stack.isReturnValue = false;
            stack = stepIn(stack); 
            let res1 = await src().bsEval.eval(copyFunction(currentTokens[4].value), stack);
            stack = stepOut(res1[1]);
            if (stack.specialFlow?.is(TYPE.operator, "break")) {
                delete stack.specialFlow;
                return [[lastResult], stepOut(stack)];
            }
            else if (stack.specialFlow?.is(TYPE.operator, "continue")) delete stack.specialFlow;
            else if (stack.specialFlow) return [[lastResult], stepOut(stack)];
            stack.isReturnValue = true;
            stack = stepIn(stack); 
            let res2 = await src().bsEval.eval(copyFunction(currentTokens[3].value), stack);
            stack = stepOut(res2[1]);
            lastResult = res2[0];
        } else return [[lastResult], stepOut(stack)];
    }
}
module.exports.preventUnboxing = true;