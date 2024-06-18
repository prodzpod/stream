const { fetch } = require("../api");
const { STREAMER_ID, nullish } = require("../common");
const { log } = require("../ws");
module.exports.execute = async (game, title) => {
    let ret = {};
    if (nullish(game)) {
        if (typeof game !== "number") game = (await require("./game").execute(game))[1];
        ret.game_id = game;
    }
    if (nullish(title)) ret.title = title.slice(0, 140);
    if (!nullish(ret)) return [1, ""];
    const res = await fetch("PATCH", "channels", {broadcaster_id: STREAMER_ID}, ret);
    return res[0] === 204 ? [0, ret] : [-1, res[1]];
}