const { fetch } = require("../api");
const { log } = require("../ws");

module.exports.execute = async name => {
    let ret = {};
    ret[typeof name === "number" ? "id" : "login"] = typeof name === "number" ? name : name.toString().toLowerCase(); 
    const res = await fetch("GET", "users", ret);
    if (res[0] !== 200) return [-1, res];
    else if (res[1].data.length) return [0, res[1].data[0]];
    return [1, ""];
}