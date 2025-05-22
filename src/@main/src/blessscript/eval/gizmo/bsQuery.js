// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype, nullish } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, toString, tokenize, toDict, detokenize } = require("../bsEvalUtil");

// int
module.exports.priority = -99;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "query");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 3;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    let subdir = toString(currentTokens[1]);
    let query = detokenize(new Token(TYPE.dict, toDict(currentTokens[2])));
    if (query.type === TYPE.error) return [[query], stack];
    stack.fuel -= 1000;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    let url = (subdir.includes("/") ? "https://prod.kr/" : "https://prod.kr/api/") + subdir + "?" + Object.entries(query)
        .filter(x => x.every(y => nullish(y)))
        .map(x => x.map(y => encodeURIComponent(String(y))).join("=")).join("&");
    let res = await fetch(url);
    res = [res.status, res.status === 200 ? (await res.text()) : null];
    if (res[0] === 200) try { res[1] = JSON.parse(res[1]); } catch {}
    return [[tokenize(res)], stack];
}