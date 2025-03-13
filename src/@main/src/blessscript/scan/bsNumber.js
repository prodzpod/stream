const { TYPE, Token } = require("../bsUtil");

// fn = (char, string, any (""), [Token], StackData) => [string || int, any, string, [Token], StackData]
module.exports.numberPreDot = (c, string, currentToken, tokens, stack) => {
    if (c === null) return exit(string, currentToken, tokens, stack);
    if ("0123456789".includes(c)) return [1, currentToken + c];
    if (c === ".") return [1, currentToken + ".", "numberPostDot"];
    return exit(string, currentToken, tokens, stack);
}

// fn = (char, string, any (""), [Token], StackData) => [string || int, any, string, [Token], StackData]
module.exports.numberPostDot = (c, string, currentToken, tokens, stack) => {
    if (c === null) return exit(string, currentToken, tokens, stack);
    if ("0123456789".includes(c)) return [1, currentToken + c];
    return exit(string, currentToken, tokens, stack);
}

function exit(string, currentToken, tokens, stack) { 
    if (currentToken === ".") return [0, null, "operator"]; 
    return [0, "", "init", [...tokens, new Token(TYPE.number, Number(currentToken))]]; 
}