const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
module.exports.execute = async (source) => {
    target = data().user[source];
    if (!target) return [0, [(await send("twitch", "user", source)).login]];
    else return [0, [target.twitch?.login, ...target.clonkspotting.boosted.map(x => data().user[x].twitch?.login)]];
}