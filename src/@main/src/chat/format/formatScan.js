const { realtype } = require("../../../common");
const { log } = require("../../../commonServer");
const { cleanup, Token, Text, TYPE } = require("./formatTypes");

function checkCondition(condition, c, ptr, arr, captures, start) {
    let match = undefined;
    const substr = arr[ptr].value.slice(c);
    let _condition = realtype(condition) === "function" ? condition(substr, c, arr[ptr].value, ptr, arr, captures, start) : condition;
    switch (realtype(_condition)) {
        case "string":
            match = substr.startsWith(_condition) ? _condition : undefined;
            break;
        case "array":
            match = _condition.find(x => substr.startsWith(x));
            break;
        case "regex": 
            match = _condition.exec(substr); 
            if (!match || match.index !== 0) match = undefined;
            break;
        case "boolean":
            match = _condition ? true : undefined;
            break;
        case "undefined": case "null": case "nan": break;
    }
    return match;
}
function checkRange(range, m, c, str, ptr, arr, captures, start) {
    switch (realtype(range)) {
        case "function": return range(m, c, str, ptr, arr, captures, start);
        case "array": return range;
        case "nan": case "null": case "undefined": 
        switch (realtype(m)) {
            case "string": return [0, m.length];
            case "array": return [0, m[0].length];
        }
    }
}
/**
 * condition: string | [string] | regex | f(substr: string, c: int, str: string, ptr: int, arr: [token], captures: int) => condition (that isnt function)
 * repl: f(match: any, c: int, str: string, ptr: int, arr: [token], captures: int) => [arr: [token], ptr: int];
 */
module.exports.scanFor = (arr, condition, repl) => {
    let captures = 0;
    for (let ptr = 0; ptr < arr.length; ptr++) {
        if (arr[ptr].type === TYPE.text) for (let c = 0; c < arr[ptr].value.length; c++) {
            if (arr[ptr].value[c] === "\\") { c++; continue; }
            const match = checkCondition(condition, c, ptr, arr, captures);
            if (match !== undefined) {
                captures++; [arr, ptr] = cleanup(...repl(match, c, arr[ptr].value, ptr, arr, captures));
                ptr--; break;
            }
        }
    }
    return arr;
}
/**
 * startCondition, endCondition: scanFor#condition + for end, args +~ start: int
 * startRange, endRange: [start: int, end: int] | f(substr: string, c: int, str: string, ptr: int, arr: [token], captures: int, start: int) => [start: int, end: int]
 * repl: f(subarr: [token], start: int, ptr: int, arr: [token], captures: int) => [arr: [token], ptr: int];
 */
module.exports.scanForDouble = (arr, startCondition, endCondition, repl, startRange, endRange) => {
    let captures = 0, start = -1;
    for (let ptr = 0; ptr < arr.length; ptr++) {
        if (arr[ptr].type === TYPE.text) for (let c = 0; c < arr[ptr].value.length; c++) {
            if (arr[ptr].value[c] === "\\") { c++; continue; }
            const match = checkCondition(captures % 2 === 0 ? startCondition : endCondition, c, ptr, arr, captures, start);
            if (match !== undefined) {
                captures++;
                if (captures % 2 === 1) { // start point
                    let range = checkRange(startRange, match, c, arr[ptr].value, ptr, arr, captures);
                    arr.splice(ptr, 1, Text(arr[ptr].value.slice(0, c + range[0])), Text(arr[ptr].value.slice(c + range[0], c + range[0] + range[1])).with("_match", match), Text(arr[ptr].value.slice(c + range[0] + range[1])));
                    start = ptr + 1;
                    ptr = ptr + 1;
                    break;
                } else { // end point
                    let range = checkRange(endRange, match, c, arr[ptr].value, ptr, arr, captures, start);
                    arr.splice(ptr, 1, Text(arr[ptr].value.slice(0, c + range[0])), Text(arr[ptr].value.slice(c + range[0], c + range[0] + range[1])).with("_match", match), Text(arr[ptr].value.slice(c + range[0] + range[1])));
                    [arr, ptr] = repl(arr.slice(start, ptr + 2), start, ptr + 1, arr, captures);
                    [arr, ptr] = cleanup(arr, ptr);
                    start = -1;
                    break;
                }
            }
        }
    }
    return arr;
}
module.exports.scanForBracket = (arr, openCondition, closeCondition, repl, startRange, endRange) => {
    let captures = 0, scope = [];
    for (let ptr = 0; ptr < arr.length; ptr++) {
        if (arr[ptr].type === TYPE.text) for (let c = 0; c < arr[ptr].value.length; c++) {
            if (arr[ptr].value[c] === "\\") { c++; continue; }
            let match = checkCondition(openCondition, c, ptr, arr, captures);
            if (match !== undefined) {
                captures++;
                let range = checkRange(startRange, match, c, arr[ptr].value, ptr, arr, captures);
                arr.splice(ptr, 1, Text(arr[ptr].value.slice(0, c + range[0])), Text(arr[ptr].value.slice(c + range[0], c + range[0] + range[1])).with("_match", match), Text(arr[ptr].value.slice(c + range[0] + range[1])));
                log(arr);
                scope.push(ptr + 1);
                ptr = ptr + 1;
                break;
            }
            else if (scope.length > 0) {
                match = checkCondition(closeCondition, c, ptr, arr, captures, scope.at(-1));
                if (match !== undefined) {
                    captures++;
                    let start = scope.pop();
                    let range = checkRange(endRange, match, c, arr[ptr].value, ptr, arr, captures, start);
                    arr.splice(ptr, 1, Text(arr[ptr].value.slice(0, c + range[0])), Text(arr[ptr].value.slice(c + range[0], c + range[0] + range[1])).with("_match", match), Text(arr[ptr].value.slice(c + range[0] + range[1])));
                    [arr, ptr] = repl(arr.slice(start, ptr + 2), start, ptr + 1, arr, captures);
                    break;
                }
            }
        }
    }
    return cleanup(arr)[0];
}