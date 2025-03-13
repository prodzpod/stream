const { WASD, realtype, numberish, unentry, stringify } = require("../../../common");
const { log } = require("../../../commonServer");
const { TYPE, Token } = require("../bsUtil");

//* scans for a specific token, counting brackets into account
// (Token, int, [Token], int=0) => int
module.exports.skipUntil = (target, index, tokens, offset = 0) => {
    let bracketLevel = 0;
    for (let i = index; i < tokens.length; i++) {
        if (tokens[i].is(TYPE.bracket, "(") || tokens[i].is(TYPE.bracket, "{")) bracketLevel += 1;
        if (tokens[i].is(TYPE.bracket, ")") || tokens[i].is(TYPE.bracket, "}")) bracketLevel -= 1;
        if (tokens[i].is(target) && bracketLevel <= 0) return i - index + 1 - offset;
    }
    return tokens.length - index + 1 - offset;
}

//* returns a list of transformed value
// lengths must match: if tokens.length = 3, rule = (a, b, c) => [a, b, c]
// ([Token], ...[[[TYPE], (...[any]) => [any]]]) => any
module.exports.transformIfType = (tokens, ...rules) => {
    for (const rule of rules) if (tokens.every((x, i) => {
        let type = realtype(rule[0][i]);
        switch (type) {
            case "null": case "undefined": return true;
            case "string": return x.type === rule[0][i];
            case "array": return rule[0][i].includes(x.type);
        }
        return false;
    })) return rule[1](...tokens.map(x => x.value));
    return new Token(TYPE.error, WASD.pack(tokens) + ": invalid type");
}

//* remove element from list (remove with types)
// ([Token], ...Token) => [Token]
module.exports.remove = (tokens, ...target) => {
    for (const t of target) tokens = tokens.filter(x => !x.is(t));
    return tokens;
}

module.exports.unbox = (tokens, stack) => tokens.map(x => {
    if (x.type !== TYPE.symbol) return x;
    return stack.var[x.value] ?? new Token(TYPE.null, null);
});

module.exports.splitTokens = (tokens, target) => {
    let ret = [];
    let start = 0; for (let i = 0; i < tokens.length; i++)
        if (tokens[i].is(target)) { ret.push(tokens.slice(start, i)); start = i + 1; }
    ret.push(tokens.slice(start, tokens.length));
    return ret;
}

//* coerce a token to a bool
// Token<any> => bool
module.exports.toBool = token => {
    let v = true;
    switch (token.type) {
        case TYPE.number: v = token.value !== 0; break;
        case TYPE.string: v = !!token.value.length; break;
        case TYPE.bool: v = token.value; break;
        case TYPE.list: v = !!token.value.length; break;
        case TYPE.dict: v = !!Object.keys(token.value).length; break;
        case TYPE.null: v = false; break;
    }
    return v;
}

//* coerce a token to a number
// Token<any> => number
module.exports.toNumber = token => {
    let v = undefined;
    switch (token.type) {
        case TYPE.number: v = token.value; break;
        case TYPE.string: v = numberish(token.value); break;
        case TYPE.bool: v = token.value ? 1 : 0; break;
        case TYPE.null: v = 0; break;
    }
    if (realtype(v) !== "number") return new Token(TYPE.error, WASD.pack(token) + " cannot be coerced into a number");
    return v;
}

//* coerce a token to a string
// Token<any> => string
module.exports.toString = token => {
    let v = undefined;
    switch (token.type) {
        case TYPE.number: v = token.value.toString(); break;
        // case TYPE.function: v = token.value
        case TYPE.bool: v = token.value.toString(); break;
        case TYPE.list: v = WASD.pack(...(module.exports.detokenize(token))); break;
        case TYPE.dict: v = WASD.pack(module.exports.detokenize(token)); break;
        case TYPE.null: v = ""; break;
        default: v = token.value; break;
    }
    return v;
}

//* coerce a token to a list
// Token<any> => list<Token>
module.exports.toList = token => {
    let v = undefined;
    switch (token.type) {
        case TYPE.number: v = new Array(token.value).fill(new Token(TYPE.null, null)); break;
        case TYPE.string: v = module.exports.tokenize(WASD.unpack(token.value)).value; break;
        case TYPE.bool: v = token.value ? [new Token(TYPE.bool, true)] : []; break;
        case TYPE.list: v = token.value; break;
        case TYPE.dict: v = Object.entries(token.value).map(x => [module.exports.tokenize(x[0]), x[1]]); break;
        case TYPE.null: v = []; break;
    }
    if (realtype(v) !== "array") return new Token(TYPE.error, WASD.pack(token) + " cannot be coerced into a list");
    return v;
}

//* coerce a token to a dict
// Token<any> => dict<string, Token>
module.exports.toDict = token => {
    let v = undefined;
    switch (token.type) {
        case TYPE.string: v = module.exports.tokenize(WASD.unpack(token.value)?.[0]).value; break;
        case TYPE.list: v = unentry(token.value.map((x, i) => [i, x])); break;
        case TYPE.dict: v = token.value; break;
        case TYPE.null: v = {}; break;
    }
    if (realtype(v) !== "object") return new Token(TYPE.error, WASD.pack(token) + " cannot be coerced into a dict");
    return v;
}

//* "unbox" a token into a js thing
// Token<any> => any
module.exports.detokenize = token => {
    switch (token.type) {
        case TYPE.list: return token.value.map(module.exports.detokenize);
        case TYPE.dict: return unentry(Object.entries(token.value).map(x => [x[0].trim(), module.exports.detokenize(x[1])]));
        default: return token.value;
    }
}

//* "box" a js thing into a token
// any => Token<any>
module.exports.tokenize = thing => {
    switch (realtype(thing)) {
        case "nan": case "null": case "undefined": return new Token(TYPE.null, null);
        case "number": case "bigint": return new Token(TYPE.number, Number(thing));
        case "string": case "regex": case "function": return new Token(TYPE.string, thing.toString());
        case "boolean": return new Token(TYPE.bool, thing);
        case "array": case "set": return new Token(TYPE.list, Array.from(thing).map(x => module.exports.tokenize(x)));
        case "object": return new Token(TYPE.dict, unentry(Object.entries(thing).map(x => [x[0].trim(), module.exports.tokenize(x[1])])));
        case "map": return new Token(TYPE.dict, unentry(Array.from(thing.entries()).map(x => [x[0].trim(), module.exports.tokenize(x[1])])));
    }
}
