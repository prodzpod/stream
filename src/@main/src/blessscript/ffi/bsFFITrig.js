const { unentry, random } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.sin = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.sin(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.cos = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.cos(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.tan = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.tan(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.atan2 = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null], [TYPE.number, TYPE.bool, TYPE.null]], (a, b) => Math.atan2(a, b)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}