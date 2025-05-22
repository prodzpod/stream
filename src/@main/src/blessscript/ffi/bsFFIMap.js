const { unentry } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, NULL, Token } = require("../bsUtil");
const { transformIfType } = require("../eval/bsEvalUtil");

// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
module.exports.map = async (args, stack) => {
    let n = await transformIfType(args, 
        [[TYPE.list, TYPE.function], async (a, b) => {
            let ret = [];
            for (let i = 0; i < a.length; i++) {
                let res = await (require("../eval/gizmo/bsCallFunction").call([a[i], i, args[0]], b, stack));
                ret.push(res[0]); stack = res[1];
            }
            return ret;
        }],
        [[TYPE.dict, TYPE.function], async (_a, b) => {
            let ret = [];
            let a = Object.entries(_a);
            for (let i = 0; i < a.length; i++) {
                let res = await (require("../eval/gizmo/bsCallFunction").call([a[i][1], i, args[0]], b, stack));
                ret.push([a[i][0], res[0]]); stack = res[1];
            }
            return unentry(ret);
        }],
    ); if (n?.type === TYPE.error) return [[n], stack];
    return [[new Token(Array.isArray(n) ? TYPE.list : TYPE.dict, n)], stack];
}