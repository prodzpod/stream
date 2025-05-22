const { unentry, random, Math } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.floor = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.floor(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.ceil = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.ceil(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.round = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.round(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.trunc = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.trunc(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.prec = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null]], (a, b) => Math.prec(a, b)],
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.prec(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}