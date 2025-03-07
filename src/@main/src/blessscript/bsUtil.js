module.exports.TYPE = { 
    // 
    number: "number", 
    string: "string",
    // 
    list: "list",
    dict: "dict",
    //
    symbol: "symbol",
    operator: "operator", 
    bracket: "bracket",
    //
    error: "error",
};

// *represents a token (operators and operands, etc) in BS.
// type = Enum<TYPE>
// value = any
class Token {
    constructor(type, value) { this.type = type; this.value = value; }
    is(a, b) {
        if (a instanceof Token) return a.type === this.type && a.value === this.value;
        else if (b !== undefined) return a === this.type && b === this.value;
        else return a === this.value;
    }
}
module.exports.Token = Token;

// *represents a state in evaluation.
// var = {string: any}
// fuel = int
// chatter = Gizmo<User>
const MAX_FUEL = 500;
class StackData {
    constructor() {
        this.var = {};
        this.fuel = MAX_FUEL;
        this.chatter = null;
        this.message = null;
    }
}
module.exports.StackData = StackData;