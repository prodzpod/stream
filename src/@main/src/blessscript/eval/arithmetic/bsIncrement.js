// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, unbox, assign } = require("../bsEvalUtil");

// int
module.exports.priority = 10;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "++");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    if (currentTokens[0].type === TYPE.symbol) {
        let val = unbox([currentTokens[0]], stack)[0];
        let n = await transformIfType([val, currentTokens[1]], 
            [[TYPE.number, null], (a, _) => a],
            [[TYPE.string, null], (a, _) => numberish(a)],
            [[TYPE.bool, null], (a, _) => a === true ? 1 : 0],
        ); if (n?.type === TYPE.error || realtype(n) !== "number") return [[n], stack];
        return [[val], assign(currentTokens[0].value, new Token(TYPE.number, n + 1), stack)];
    }
    let n = await transformIfType(currentTokens, 
        [[TYPE.number, null], (a, _) => a],
        [[TYPE.string, null], (a, _) => numberish(a)],
        [[TYPE.bool, null], (a, _) => a === true ? 1 : 0],
    ); if (n?.type === TYPE.error || realtype(n) !== "number") return [[n], stack];
    return [[new Token(TYPE.number, n + 1)], stack];
}
module.exports.preventUnboxing = true;