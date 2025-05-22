const { log } = require("../ws");

module.exports.execute = async (name, isJudas, amount, price) => {
    await require("../api/WS/jesusislit/recentpurchases")._send("recentsold", name, isJudas, amount, price);
    return [0, ""];
}