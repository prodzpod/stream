const { unentry, random } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType, detokenize, tokenize } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.sqrt = async (args, stack) => {
    let n = await transformIfType(args, 
        [[[TYPE.number, TYPE.bool, TYPE.null]], (a) => Math.sqrt(a)],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(TYPE.number, n)], stack];
}