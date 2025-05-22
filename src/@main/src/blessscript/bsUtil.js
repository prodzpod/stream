const { stringify, realtype } = require("../../common");
const { log, listFiles } = require("../../commonServer");

module.exports.TYPE = { 
    // 
    number: "number", 
    string: "string",
    bool: "bool",
    // 
    list: "list",
    dict: "dict",
    function: "function",
    symbol: "symbol",
    //
    operator: "operator", 
    bracket: "bracket",
    //
    null: "null",
    error: "error",
};

// *represents a token (operators and operands, etc) in BS.
// type = Enum<TYPE>
// value = any
class Token {
    constructor(type, value) { this.type = type; this.value = value; }
    is(a, b) {
        if (a instanceof Token) return a.type === this.type && module.exports.subSort(a.value, this.value) === 0;
        else if (b !== undefined) return a === this.type && module.exports.subSort(b, this.value) === 0;
        else return module.exports.subSort(a, this.value) === 0;
    }
}
module.exports.Token = Token;
module.exports.NULL = new Token(module.exports.TYPE.null, null);

//* sort two "strings" windows folder style (taking "sub-number" into account)
// (string || number || bool || list || null, string || number || bool || list || null) => int
module.exports.subSort = (a, b) => {
    let ta = realtype(a), tb = realtype(b);
    if (!["string", "number", "boolean", "array", "null", "undefined"].includes(ta) || !["string", "number", "array", "null", "undefined"].includes(tb)) {
        if (ta === tb && stringify(a) === stringify(b)) return 0;
        return new Token(module.exports.TYPE.error, a + ", " + b + ": is not sortable");
    }
    // if one or both is list
    if (ta === "array" || tb === "array") {
        if (ta !== "array") a = [a];
        if (tb !== "array") b = [b];
        for (let i = 0; i < Math.max(a.length, b.length); i++) {
            let sub = module.exports.subSort(a[i], b[i]);
            if (sub !== 0) return sub;
        }
        return 0;
    }
    // if one of both is null
    let ua = ta === "null" || ta === "undefined", ub = tb === "null" || tb === "undefined";
    if (ua && ub) return 0; if (ua) return -1; if (ub) return 1;
    if (ta === "boolean") a = Number(a); if (tb === "boolean") b = Number(b);
    a = a.toString(); b = b.toString();
    // real string to string now
    let sa = 0, na = 0, sb = 0, nb = 0;
    while (sa < a.length && sb < b.length) {
        if ("0123456789".includes(a[sa]) && "0123456789".includes(b[sb])) {
            na += 1; while ("0123456789".includes(a[na])) na += 1;
            nb += 1; while ("0123456789".includes(b[nb])) nb += 1;
            let cmp = Number(a.slice(sa, na)) - Number(b.slice(sb, nb));
            if (cmp !== 0) return cmp;
        }
        let cmp2 = a[sa].localeCompare(b[sb]); if (cmp2 !== 0) return cmp2;
        sa = na + 1; sb = nb + 1; na = sa; nb = sb;
    }
    if (sa < a.length && sb < b.length) return 0;
    if (sa < a.length) return -1; if (sb < b.length) return 1;
    return 0;
}

// *represents a state in evaluation.
// var = {string: any}
// fuel = int
// chatter = Gizmo<User>
module.exports.MAX_FUEL = 5000;
class StackData {
    constructor() {
        this.var = [{...DEFAULT_VARS}];
        this.fuel = module.exports.MAX_FUEL;
        this.chatter = null;
        this.message = null;
        this.isReturnValue = true;
    }
}
module.exports.StackData = StackData;
let DEFAULT_VARS = {
    PI: Math.PI,
    E: Math.E
};
(async () => {
    for (let f of await listFiles("src/@main/src/blessscript/ffi")) {
        let exp = require("./ffi/" + f);
        for (let k of Object.keys(exp)) {
            if (k.startsWith("_")) continue;
            DEFAULT_VARS[k] = ffi(exp[k]);
        }
    }
})();
// ffi function: ([Token]: args, StackData: stack) => [[Token]: ret, StackData: stack];
function ffi(fn) { return new Token(module.exports.TYPE.function, { args: "ffi", fn: fn }); }