const { src } = require("../../..");
const { remove } = require("../../../common");
const { listFiles } = require("../../../commonServer");
const { TYPE, Token } = require("../bsUtil");
const { checkHead, isWord } = require("./bsScanUtil");

const FILE_EXCEPTIONS = ["bsScan", "bsScanUtil"];
let STATE;

// *parses blessscript string into list of BS tokens.
// *(string) => [Token]
// fn = (char, string, any (""), [Token], StackData) => [string || int, any, string, [Token], StackData]
module.exports.scan = async (string, stack) => {
    STATE = {
        init: (c, string, currentToken, tokens, stack) => {
            if (c === null) return []; let temp;
            // number
            temp = checkHead(string, "Infinity"); if (temp) return [temp.length, "", "init", [...tokens, new Token(TYPE.number, Infinity)]];
            if ("0123456789.".includes(c)) return [0, null, "numberPreDot"];
            // operator
            for (const keyword of ["in", "is", "typeof", "call", "query", "bool", "number", "string", "list", "dict", "sleep"]) 
                { temp = checkHead(string, keyword); if (temp) return [temp.length, "", "init", [...tokens, new Token(TYPE.operator, keyword)]]; }
            if ("+-*/%^=!&|?:<>~,;".includes(c)) return [1, c, "operator"];
            // string
            if (c === "\"") return [1, "", "string"];
            // bool
            temp = checkHead(string, "true"); if (temp) return [temp.length, "", "init", [...tokens, new Token(TYPE.bool, true)]];
            temp = checkHead(string, "false"); if (temp) return [temp.length, "", "init", [...tokens, new Token(TYPE.bool, false)]];
            temp = checkHead(string, "null"); if (temp) return [temp.length, "", "init", [...tokens, new Token(TYPE.null, null)]];
            // bracket
            if ("(){}[]".includes(c)) return [1, "", "init", [...tokens, new Token(TYPE.bracket, c)]];
            // symbol
            if (isWord(c)) return [1, c, "symbol"];
            // ?
            return [1];
        }
    };
    for (let f of remove((await listFiles("src/@main/src/blessscript/scan")).map(x => x.slice(0, -".js".length)), ...FILE_EXCEPTIONS)) 
        for (let [k, v] of Object.entries(src()[f]))
            STATE[k] = v;
    let state = "init";
    let tokens = [], currentToken = "";
    async function doState(s) { 
        let res = STATE[state](string[0] ?? null, string, currentToken, tokens, stack);
        if (res instanceof Promise) res = await res;
        if (string) {
            if (typeof res[0] === "number") string = string.slice(res[0]);
            else if (typeof res[0] === "string") string = res[0];
        }
        if (res[1] !== undefined && res[1] !== null) currentToken = res[1];
        if (res[2] !== undefined && res[2] !== null) state = res[2];
        if (res[3] !== undefined && res[3] !== null) tokens = res[3];
        if (res[4] !== undefined && res[4] !== null) stack = res[4];
    }
    while (string.length) await doState(string);
    await doState(""); // EOF
    return [tokens, stack];
}