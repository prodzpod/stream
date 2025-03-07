const { TYPE, Token } = require("../bsUtil");
const OPERATOR_CHAINS = {
    "+": "=",
    "-": "=",
    "*": "=*",
    "**":"=",
    "/": "=",
    "%": "=",
    "^": "=",
    "=": "=",
    "!": "=",
    "&": "&=",
    "|": "|=",
    "?": ".?",
    "<": "=",
    ">": "=",
}

// fn = (char, string, any (""), [Token], StackData) => [string || int, any, string, [Token], StackData]
module.exports.operator = (c, string, currentToken, tokens, stack) => {
    if (c === null) return exit(string, currentToken, tokens, stack);
    if (OPERATOR_CHAINS[currentToken]?.includes(c)) return [1, currentToken + c];
    return exit(string, currentToken, tokens, stack);
}

function exit(string, currentToken, tokens, stack) { 
    if ("+-".includes(currentToken) && (!tokens.length || tokens.at(-1).type === TYPE.operator)) currentToken = "UNARY" + currentToken;
    return [0, "", "init", [...tokens, new Token(TYPE.operator, currentToken)]]; 
}