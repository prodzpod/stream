// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { skipUntil, splitTokens, toString, stepIn, stepOut } = require("../bsEvalUtil");

// int
module.exports.priority = 100;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.bracket, "{") 
    && ((skipUntil("}", index, tokens) > skipUntil(",", index, tokens, 0, -1)) || tokens[index + 1]?.is(TYPE.bracket, "}"));
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, "}"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens.length === 2) return [[new Token(TYPE.dict, {})], stack];
    let ts = splitTokens(currentTokens.slice(1, -1), new Token(TYPE.operator, ","));
    let value = {};
    for (let kv of ts) {
        let _value = splitTokens(kv, new Token(TYPE.operator, ":"));
        let lvalue, rvalue;
        if (_value.length === 2) [lvalue, rvalue] = _value;
        if (lvalue.length > 1) return [[new Token(TYPE.error, "lvalue is more than 1 token")], stack];
        lvalue = toString(lvalue[0]);
        stack.fuel -= 1;
        if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
        stack.isReturnValue = true;
        stack = stepIn(stack);
        let res = await src().bsEval.eval(rvalue, stack);
        stack = stepOut(res[1]); rvalue = res[0];
        value[lvalue.trim()] = rvalue;
    }
    stack.fuel -= 1;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    return [[new Token(TYPE.dict, value)], stack];
}
module.exports.preventUnboxing = true;