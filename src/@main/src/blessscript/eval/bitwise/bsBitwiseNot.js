// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token, subSort } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = -11;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "~");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    // we have to math this bc js bitwise sucks
    let n = await transformIfType(currentTokens, 
        [[null, [TYPE.number, TYPE.bool, TYPE.null]], (_, a) => Number(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    let a = Math.floor(n), b = 0, c = 0;
    for (let i = 1; a !== 0 || (Math.log(b) / Math.log(2)) % 1 !== 0; i *= 2) {
        let ga = a % (i * 2) > 0; b++;
        if (ga) a -= i; if (!ga) c += i;
    }
    return [[new Token(TYPE.number, c)], stack];
}