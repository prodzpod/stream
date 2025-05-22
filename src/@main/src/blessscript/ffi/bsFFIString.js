const { unentry, random, time } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.toUpperCase = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.string]], (a) => a.toUpperCase()],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.string, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.toLowerCase = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.string]], (a) => a.toLowerCase()],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.string, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.trim = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.string]], (a) => a.trim()],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.string, n)], stack];
}