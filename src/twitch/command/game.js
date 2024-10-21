const { fetch } = require("../api");
module.exports.execute = async name => {
    const res = await fetch("GET", "games", {name: name});
    if (res[0] !== 200) return [-1, res[1]];
    else if (res[1].data.length) return [0, res[1].data[0].id];
    return [1, ""];
}