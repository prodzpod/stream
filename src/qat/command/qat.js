const fetch = require("node-fetch");
const { log } = require("../ws");
module.exports.execute = async (str) => {
    const a = await fetch(`https://www.quinapalus.com/cgi-bin/qat?pat=${str}&ent=Search&dict=${require("./dict").dict()}`, {method: "GET"});
    return [a.status === 200 ? 0 : 1, await a.text()];
}