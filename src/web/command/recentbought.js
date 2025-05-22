const { log } = require("../ws");

module.exports.execute = async (chatter, isJudas, amount, price) => {
    await require("../api/WS/jesusislit/recentpurchases")._send("recentbought", chatter, isJudas, amount, price);
    return [0, ""];
}