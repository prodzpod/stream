const { TYPE, Token } = require("../bsUtil");

// fn = (char, string, any (""), [Token], StackData) => [string || int, any, string, [Token], StackData]
module.exports.string = (c, string, currentToken, tokens, stack) => {
    if (c === null) return exit(string, currentToken, tokens, stack);
    if (c === "\\" && string.length >= 2) return [2, currentToken + string[1]];
    if (c === "\"") return exit(string, currentToken, tokens, stack);
    return [1, currentToken + c];
}

function exit(string, currentToken, tokens, stack)
    { return [1, "", "init", [...tokens, new Token(TYPE.string, currentToken)]]; }