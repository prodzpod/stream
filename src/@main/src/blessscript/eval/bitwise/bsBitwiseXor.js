// *priority for precedents, same priority are executed in left to right, higher runs first

const { numberish, realtype } = require("../../../../common");
const { TYPE, Token, subSort } = require("../../bsUtil");
const { transformIfType } = require("../bsEvalUtil");

// int
module.exports.priority = -11;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "^");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = -1;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    // we have to math this bc js bitwise sucks
    let n = await transformIfType(currentTokens, 
        [[[TYPE.number, TYPE.bool, TYPE.null], null, [TYPE.number, TYPE.bool, TYPE.null]], (a, _, b) => [Number(a), Number(b)]],
        [[TYPE.list, null, TYPE.list], (a, _, b) => [TYPE.list, [...a.filter(x => !b.some(y => x.is(y))), ...b.filter(x => !a.some(y => x.is(y)))]]],
        [[TYPE.dict, null, TYPE.dict], (a, _, b) => [TYPE.dict, {...unentry(Object.keys(a).filter(k => !b[k] || !a[k].is(b[k])).map(x => [x, a[x]])), ...unentry(Object.keys(b).filter(k => !a[k] || !b[k].is(a[k])).map(x => [x, b[x]]))}]],
    ); if (n?.type === TYPE.error) return [[n], stack];
    if (typeof n[0] !== "number") return [[new Token(...n)], stack];
    let a = Math.floor(n[0]), b = Math.floor(n[1]), c = 0;
    for (let i = 1; a !== 0 || b !== 0; i *= 2) {
        let ga = a % (i * 2) > 0, gb = b % (i * 2) > 0;
        if (ga) a -= i; if (gb) b -= i; if (ga !== gb) c += i;
    }
    return [[new Token(TYPE.number, c)], stack];
}