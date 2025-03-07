const { src } = require("../../..");
const { listFiles, log } = require("../../../commonServer");

const FILE_EXCEPTIONS = ["bsEval", "bsEvalUtil"];
let rules;

// *evaluates blessscript token list into a return value.
// *([Token], stackData) => [any, stackData]
module.exports.eval = async (tokens, stack) => {
    if (!rules) {
        rules = [];
        let ruleObjects = {};
        let rulePrios = [];
        for (let k of (await listFiles("src/@main/src/blessscript/eval"))
            .map(x => x.slice(0, -".js".length))
            .filter(x => !FILE_EXCEPTIONS.includes(x))) {
            let rule = src()[k];
            ruleObjects[rule.priority] ??= [];
            ruleObjects[rule.priority].push(rule);
            rulePrios.push(rule.priority);
        }
        for (let k of rulePrios.sort((a, b) => b - a)) rules.push(ruleObjects[k]);
    }
    for (const ruleGroup of rules) for (let ptr = 0; ptr < tokens.length; ptr++) {
        let currentToken = tokens[ptr];
        for (const rule of ruleGroup) {
            if (rule.condition(currentToken, ptr, tokens, stack)) {
                let offset = typeof rule.offset === "number" ? rule.offset : rule.offset(currentToken, ptr, tokens, stack);
                if (offset instanceof Promise) offset = await offset;
                let amount = typeof rule.amount === "number" ? rule.amount : rule.amount(currentToken, ptr, tokens, offset, stack);
                if (amount instanceof Promise) amount = await amount;
                const from = Math.max(0, ptr + offset),
                    to = Math.min(tokens.length, ptr + offset + amount);
                let result = rule.result(tokens.slice(from, to), ptr, tokens, offset, amount, stack);
                if (result instanceof Promise) result = await result;
                if (result[0]) tokens.splice(from, to - from, ...result[0]);
                if (result[1]) stack = result[1];
                if (offset <= 0) ptr -= Math.min(Math.abs(offset - 1), amount);
            }
        }
    }
    return [tokens.at(-1), stack];
}