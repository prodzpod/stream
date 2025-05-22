const { log } = require("../../../commonServer");
const { scanForDouble, scanFor } = require("./formatScan");
const { Tag, Text, cleanup } = require("./formatTypes")

module.exports.simpleTagSelfClosing = (arr, cond, tokens, fn) => {
    return scanFor(arr, cond, (m, c, str, ptr, arr, i) => {
        if (typeof tokens === "function") tokens = tokens(m, c, str, ptr, arr, i);
        if (!Array.isArray(tokens)) tokens = [tokens];
        tokens = tokens.map(x => x.clone());
        let l = Array.isArray(m) ? m[0].length : m.length;
        arr.splice(ptr, 1, Text(str.slice(0, c)), ...tokens, Text(str.slice(c + l)));
        ptr += 1 + tokens.length;
        if (fn) [arr, ptr] = fn(m, c, str, ptr, arr, i);
        return [arr, ptr];
    });
} 
module.exports.simpleTag = (arr, start, end, tag, fn) => {
    return scanForDouble(arr, start, end, (subarr, start, end, arr) => {
        arr[start] = Tag(tag);
        arr[end] = Tag("/" + tag);
        if (fn) [arr, end] = fn(subarr, start, end, arr);
        return [arr, end];
    });
}