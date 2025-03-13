// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype, Math } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, skipUntil, splitTokens, toString } = require("../bsEvalUtil");

// int
module.exports.priority = 21;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.bracket, "[") && index !== 0 && (tokens[index - 1].type === TYPE.list || tokens[index - 1].type === TYPE.dict);
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = (_, index, tokens, offset, stack) => skipUntil(new Token(TYPE.bracket, "]"), index, tokens, offset);
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let lvalue = currentTokens[0];
    switch (lvalue.type) {
        case TYPE.list: {
            let rvalue = splitTokens(currentTokens.slice(2, -1), new Token(TYPE.operator, ":"));
            stack.fuel -= 1;
            if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
            for (let i = 0; i < rvalue.length; i++) {
                let res = await src().bsEval.eval(rvalue[i], stack);
                rvalue[i] = res[0]; stack = res[1];
                if (rvalue[i].type !== TYPE.number && rvalue[i].type !== TYPE.null) return [[new Token(TYPE.error, `accessor: rvalue[${i}] is not a number`)], stack];
            }
            rvalue = rvalue.map(x => x.value);
            if (rvalue.length === 1) return [[lvalue.value[rvalue[0] ?? 0] ?? new Token(TYPE.null, null)], stack];
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
            let res = await src().bsEval.eval(rvalue, stack);
            rvalue = res[0]; stack = res[1];
            return [[lvalue.value[toString(rvalue)] ?? new Token(TYPE.null, null)], stack];
        }
    }
}
module.exports.preventUnboxing = true;