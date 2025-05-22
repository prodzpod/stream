// *priority for precedents, same priority are executed in left to right, higher runs first

const { src } = require("../../../..");
const { numberish, realtype } = require("../../../../common");
const { log } = require("../../../../commonServer");
const { TYPE, Token } = require("../../bsUtil");
const { transformIfType, toString, tokenize } = require("../bsEvalUtil");

// int
module.exports.priority = -99;
// (Token, int, [Token], StackData) => bool
module.exports.condition = (currentToken, index, tokens, stack) => currentToken.is(TYPE.operator, "call");
// int || (Token, int, [Token], StackData) => int || [int, StackData]
module.exports.offset = 0;
// int || (Token, int, [Token], int, StackData) => int || [int, StackData]
module.exports.amount = 2;
// ([Token], int, [Token], int, int, StackData) => [[Token], StackData]
module.exports.result = async (currentTokens, index, tokens, offset, amount, stack) => {
    stack.fuel -= 1000;
    if (stack.fuel < 0) return [[new Token(TYPE.error, "out of fuel")], stack];
    let from = stack.from;
    let str = toString(currentTokens[1]);
    if (str.startsWith("!!")) str = str.slice(1);
    else { from = {...stack.from}; delete from._reply; }
    // todo: collect reply into result dict as well
    let res = await src().chat.message(from, stack.chatter, stack.message, str, [], null);
    stack.chatter = src().user.identify(stack.chatter);
    return [[tokenize(res)], stack];
}