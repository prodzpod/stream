const { log, send } = require("../../../ws");

module.exports.execute = async (query, body) => {
    await send("hwg", "send", "actorswap-reset");
    await send("hwg", "send", "heatmap-reset");
    return [200, await send("hwg", "send", "paint")]
}