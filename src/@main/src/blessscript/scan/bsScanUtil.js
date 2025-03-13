// \w like in regex
// char => bool
module.exports.isWord = c => {
    if (!c) return false;
    let i = c.charCodeAt(0);
    return (0x30 <= i && i <= 0x39) // number
        || (0x41 <= i && i <= 0x5A) // capital
        || (0x61 <= i && i <= 0x7A) // lowercase
        || i === 0x5F // _
}

// \s like in regex
// char => bool
module.exports.isWhitespace = c => !c?.trim().length;

// \b like in regex, returns the matched string if true
// string, [string] => string || "false"
module.exports.checkHead = (string, ...matches) => {
    for (let m of matches) if (string.startsWith(m) && (
        module.exports.isWhitespace(string[m.length]) || (
            module.exports.isWord(string[m.length - 1]) 
            !== module.exports.isWord(string[m.length])
        )
    )) return m;
    return false;
}