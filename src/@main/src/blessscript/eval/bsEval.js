const { src } = require("../../..");
const { unentry } = require("../../../common");
const { listFiles, log } = require("../../../commonServer");
const { TYPE, Token, NULL } = require("../bsUtil");
const { unbox, splitTokens, selectiveUnboxFunctions } = require("./bsEvalUtil");

const FILE_EXCEPTIONS = ["bsEval", "bsEvalUtil"];
let rules;

// *evaluates blessscript token list into a return value.
// *([Token], stackData) => [any, stackData]
module.exports.eval = async (tokens, stack) => {
    const isReturnValue = stack.isReturnValue;
    // if (stack.chatter.twitch.login === "prodzpod") log("eval started:", tokens);
    if (!rules) {
        rules = [];
        let ruleObjects = {};
        let rulePrios = [];
        for (let k of (await listFiles("src/@main/src/blessscript/eval"))
            .map(x => x.slice(0, -".js".length))
            .filter(x => !FILE_EXCEPTIONS.includes(x))) {
            let rule = src()[k.split("/").at(-1)];
            ruleObjects[rule.priority] ??= [];
            ruleObjects[rule.priority].push(rule);
            rulePrios.push(rule.priority);
        }
        for (let k of rulePrios.sort((a, b) => b - a)) rules.push(ruleObjects[k]);
    }
    for (const ruleGroup of rules) {
        let scanRTL = [2, -100, 22, 150].includes(ruleGroup[0].priority);
        for (
            let ptr = scanRTL ? tokens.length - 1 : 0; 
            scanRTL ? (ptr >= 0) : (ptr < tokens.length); 
            scanRTL ? (ptr--) : (ptr++)
        ) {
            let currentToken = tokens[ptr];
            for (const rule of ruleGroup) {
                if (rule.condition(currentToken, ptr, tokens, stack)) {
                    let offset = typeof rule.offset === "number" ? rule.offset : rule.offset(currentToken, ptr, tokens, stack);
                    if (offset instanceof Promise) offset = await offset;
                    let amount = typeof rule.amount === "number" ? rule.amount : rule.amount(currentToken, ptr, tokens, offset, stack);
                    if (amount instanceof Promise) amount = await amount;
                    const from = ptr + offset, to = ptr + offset + amount;
                    if (from < 0 || to > tokens.length) 
                        return [describeError(tokens[ptr].value + " tried to eat tokens outside of the range", tokens[ptr], ptr, tokens, stack), stack];
                    let currentTokens = tokens.slice(from, to);
                    if (!rule.preventUnboxing) currentTokens = unbox(currentTokens, stack); // not assignments
                    let result = rule.result(currentTokens, ptr, tokens, offset, amount, stack);
                    if (result instanceof Promise) result = await result;
                    const err = result?.[0].find(x => x.type === TYPE.error); if (err) {
                        if (typeof err.value === "string") 
                            return [describeError(err.value, tokens.slice(from, to), ptr, tokens, stack), stack];
                        return [err, stack];
                    }
                    if (result[0]) tokens.splice(from, to - from, ...result[0]);
                    if (result[1]) stack = result[1];
                    if (stack.specialFlow !== undefined) break;
                    // from [ptr+offset :: to ptr+offset+amount ] => result[0].length
                    // ptr = at the head of result[0].length - 1
                    if (scanRTL) ptr = Math.min(tokens.length - 1, to + 1);
                    else ptr = Math.max(0, from - 1);
                    currentToken = tokens[ptr];
                    // if (stack.chatter.twitch.login === "prodzpod") log("midpoint:", ruleGroup[0].priority, tokens, stack.var);
                }
            }
            if (stack.specialFlow !== undefined) break;
        }
        if (stack.specialFlow !== undefined) break;
    }
    let ret = splitTokens(tokens, new Token(TYPE.operator, ","));
    ret = ret.map(x => x.reverse().find(x => x.type !== TYPE.null) ?? NULL);
    if (stack.specialFlow && stack.specialFlow.type != TYPE.operator)
        ret = [stack.specialFlow];
    stack.numReturnValues = ret.length;
    if (isReturnValue) {
        ret = unbox(ret, stack);
        ret = selectiveUnboxFunctions(ret, stack);
    }
    if (ret.length === 0) return [NULL, stack];
    else if (ret.length === 1) return [ret[0], stack];
    else return [new Token(TYPE.list, ret), stack];
}

function describeError(message, currentTokens, ptr, tokens, stack) { return new Token(TYPE.error, {
    "message": message,
    "currentTokens": currentTokens,
    "index": ptr,
    "tokens": tokens,
    "stack": unentry(Object.entries(stack).filter(x => !["chatter", "message"].includes(x[0])))
}); }