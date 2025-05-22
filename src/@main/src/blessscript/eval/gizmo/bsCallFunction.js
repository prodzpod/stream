// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { unentry } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, NULL } = require("../../bsUtil");
const { skipUntil, stepIn, stepOut, unbox, tokenize, detokenize, copyFunction } = require("../bsEvalUtil");

// int
module.exports.priority = 21;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => {
    if (!currentToken.is(TYPE.bracket, "(")) return false;
    if (index === 0) return false;
    return tokens[index - 1].type === TYPE.function || unbox([tokens[index - 1]], stack)[0].type === TYPE.function;
}
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, ")"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let func = unbox([currentTokens[0]], stack)[0].value;
    let args = currentTokens.slice(1);
    if (args.length === 2) args = [];
    else {
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack = stepIn(stack); 
        stack.isReturnValue = true;
        let res = await src().bsEval.eval(args.slice(1, -1), stack);
        stack = res[1]; 
        stack = stepOut(stack);
        if (stack.numReturnValues === 1) args = [res[0]];
        else args = res[0].value;
    }
    return await module.exports.call(args, func, stack);
}
module.exports.call = async (args, func, stack) => {
    if (func.args === "ffi") return await func.fn(args, stack);
    args = args.slice(0, func.args.length);
    while (args.length < func.args.length) args.push(NULL);
    stack.fuel -= 1;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    stack = stepIn(stack, unentry(args.map((x, i) => [func.args[i], x])));
    stack.isReturnValue = true;
    // log("call:", func.fn, unentry(args.map((x, i) => [func.args[i], x])));
    // fucked deep copy
    let ret = await src().bsEval.eval(copyFunction(func), stack);
    stack = stepOut(ret[1]);
    delete stack.specialFlow;
    // log("call result:", ret[0]);
    return [[ret[0]], stack];
}
module.exports.preventUnboxing = true;