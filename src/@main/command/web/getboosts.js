const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
module.exports.execute = async (source) => {
    let chatter = typeof source === "number" ? data().user[source] : Object.values(data().user).find(x => x.twitch?.login === source);
    return [0, {boost: chatter?.clonkspotting?.boost ?? 0}];
}