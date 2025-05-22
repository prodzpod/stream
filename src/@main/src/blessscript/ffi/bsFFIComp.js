const { unentry, random, Math } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.min = async (args, stack) => {
    return [[tokenize(Math.min(...args.map(detokenize)))], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.max = async (args, stack) => {
    return [[tokenize(Math.max(...args.map(detokenize)))], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.lerp = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null]], (a, b, c) => Math.lerp(a, b, c)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.clamp = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null]], (a, b, c) => Math.clamp(a, b, c)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.between = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool]], (a, b, c, d) => Math.between(a, b, c, d)],
        [[[TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null]], (a, b, c) => Math.between(a, b, c)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}