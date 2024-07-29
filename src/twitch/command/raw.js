const { fetch } = require("../api");

module.exports.execute = async (method, subdir = "", query, body, isEncoded = false) => {
    const res = await fetch(method, subdir, query, body, isEncoded);
    if (res[0] !== 200) return [-1, res];
    else if (res[1].data?.[0]) return [0, res[1].data[0]];
    return [0, ""];
}