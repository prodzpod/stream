const { fetch } = require("../api");

module.exports.execute = async (method, subdir = "", query, body, isEncoded = false) => {
    const res = await fetch(method, subdir, query, body, isEncoded);
    if (res[0] !== 200) return [-1, res];
    else return [0, res[1]];
}