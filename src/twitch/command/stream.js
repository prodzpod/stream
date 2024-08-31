const { fetch } = require("../api");
const { log } = require("../ws");

module.exports.execute = async name => {
    let ret = {user_login: name};
    const res = await fetch("GET", "streams", ret);
    if (res[0] !== 200) return [-1, res];
    else if (res[1].data.length) {
        res[1].data[0].user = (await require("./user").execute(Number(res[1].data[0].user_id)))?.[1];
        return [0, res[1].data[0]];
    }
    return [1, ""];
}