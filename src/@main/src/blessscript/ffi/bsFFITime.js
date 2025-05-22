const { unentry, random, time } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.time = async (args, stack) => {
    return [[new Token(TYPE.number, Number(time() - time("2025-01-01")) / 1000)], stack];
}