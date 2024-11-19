const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
const DAY = BigInt(24*60*60*1000);
module.exports.execute = async (source) => {
    target = data().user[source];
    if (!target?.clonkspotting?.spotted) return [0, [(await send("twitch", "user", source)).login]];
    else {
        const t = time();
        target.clonkspotting.spotted = target.clonkspotting.spotted.filter(x => BigInt(x.time) + DAY > t);
        data(`user.${target.twitch.id}`, target);
        return [0, [target.twitch?.login, ...target.clonkspotting.spotted.map(x => data().user[x.id].twitch?.login)]];
    }
}