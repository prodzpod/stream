const { fetch } = require("../api");
const { log } = require("../ws");

module.exports.execute = async id => {
    const res = await fetch("GET", "channels", {broadcaster_id: id});
    log(res);
    if (res[0] !== 200) return [-1, res];
    else if (res[1].data.length) return [0, res[1].data[0]];
    return [1, ""];
}