// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype, Math } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token, NULL } = require("../../bsUtil");
const { skipUntil, splitTokens, toString, unbox, stepIn, stepOut } = require("../bsEvalUtil");

// int
module.exports.priority = 21;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => {
    if (!currentToken.is(TYPE.bracket, "[")) return false;
    if (index === 0) return false; // different
    if (tokens[index - 1].type === TYPE.list 
        || tokens[index - 1].type === TYPE.dict
        || tokens[index - 1].type === TYPE.string) return true; // different
    if (tokens[index - 1].type === TYPE.symbol) {
        let unboxed = unbox([tokens[index - 1]], stack)[0];
        if (unboxed.type === TYPE.list 
            || unboxed.type === TYPE.dict
            || unboxed.type === TYPE.string) return true; // different
    }
    return false; // different
}
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, "]"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let lvalue = unbox([currentTokens[0]], stack)[0];
    switch (lvalue.type) {
        case TYPE.list: {
            let rvalue = splitTokens(currentTokens.slice(2, -1), new Token(TYPE.operator, ":"));
            stack.fuel -= 1;
            if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
            for (let i = 0; i < rvalue.length; i++) {
                stack.isReturnValue = true;
                stack = stepIn(stack);
                let res = await src().bsEval.eval(rvalue[i], stack);
                rvalue[i] = res[0]; stack = stepOut(res[1]);
                if (rvalue[i].type !== TYPE.number && rvalue[i].type !== TYPE.null) return [[new Token(TYPE.error, `accessor: rvalue[${i}] is not a number`)], stack];
            }
            rvalue = rvalue.map(x => x.value);
            if (rvalue.length === 1) return [[lvalue.value[rvalue[0] ?? 0] ?? NULL], stack];
            rvalue[0] ??= 0; rvalue[1] ??= lvalue.value.length; rvalue[2] ??= 1;
            lvalue = lvalue.value.slice(rvalue[0], rvalue[1]);
            let target = rvalue[2] < 0 ? (lvalue.length - 1) : 0;
            let ret = [lvalue[target]], 
                i = Math.posmod(target + rvalue[2], lvalue.length);
            while (i !== target) { ret.push(lvalue[i]); i = Math.posmod(i + rvalue[2], lvalue.length); }
            return [[new Token(TYPE.list, ret)], stack]; 
        }
        case TYPE.dict: {
            let rvalue = currentTokens.slice(2, -1);
            stack.fuel -= 1;
            if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
            stack.isReturnValue = true;
            stack = stepIn(stack);
            let res = await src().bsEval.eval(rvalue, stack);
            rvalue = res[0]; stack = stepOut(res[1]);
            return [[lvalue.value[toString(rvalue)] ?? NULL], stack];
        }
        case TYPE.string: {
            let rvalue = currentTokens.slice(2, -1);
            stack.fuel -= 1;
            if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
            stack.isReturnValue = true;
            stack = stepIn(stack);
            let res = await src().bsEval.eval(rvalue, stack);
            rvalue = res[0]; stack = stepOut(res[1]);
            if (rvalue.type !== TYPE.number) return [[new Token(TYPE.error, "rvalue is not a number: " + rvalue)], stack];
            rvalue = rvalue.value; if (rvalue < 0) rvalue = lvalue.value.length + rvalue;
            return [[new Token(TYPE.string, lvalue.value[rvalue] ?? "") ?? NULL], stack];
        }
        default:
            return [[new Token(TYPE.error, "accessor: invalid type")], stack];
    }
}
module.exports.preventUnboxing = true;