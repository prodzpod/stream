const { time } = require("../../common");
const { log, info } = require("../../commonServer")

module.exports.execute = (id, name, refresh) => {
    info("shoutout given:", name, id);
    setTimeout(() => send("twitch", "send", null, "[🌙] Shoutout Cooldown Ended!", []), Number(time(refresh) - time()));
    return [0, ""];
}