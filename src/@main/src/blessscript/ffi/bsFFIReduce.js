const { unentry } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.reduce = async (args, stack) => {
    let n = await transformIfType(args, 
        [[TYPE.list, TYPE.function], async (a, b) => {
            let value = args[2] ?? NULL;
            for (let i = 0; i < a.length; i++) {
                let res = await (require("../eval/gizmo/bsCallFunction")
                    .call([value, a[i], new Token(TYPE.number, i), args[0]], b, stack));
                value = res[0]; stack = res[1];
                if (value.type === TYPE.error) break;
            }
            return value;
        }],
    ); return [[n], stack];
}