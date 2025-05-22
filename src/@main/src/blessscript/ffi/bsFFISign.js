const { unentry, random } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.sign = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.sign(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.abs = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.abs(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}