const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
const { log } = require("../../commonServer");
const DAY = BigInt(24*60*60*1000);
module.exports.execute = async (source, target) => {
    source = data().user[source]?.twitch?.id ?? (await send("twitch", "user", numberish(source)))?.id;
    target = data().user[target]?.twitch?.id ?? (await send("twitch", "user", numberish(target)))?.id;
    if (nullish(source) === null || nullish(target) === null) return [1, "invalid person"];
    if (source === target) return [1, "you can't spot yourself..."];
    source = await src().user.initialize(source, true);
    let t = time();
    source.clonkspotting.spotted = source.clonkspotting.spotted.filter(x => BigInt(x.time) + DAY > t);
    if (source.clonkspotting.spotted.some(x => x.id === target)) return [1, "you already boosted this person"];
    target = await src().user.initialize(target, true);
    source.clonkspotting.boost += 1;
    target.clonkspotting.boost += 1;
    source.clonkspotting.spotted.push({id: target.twitch.id, time: t});
    data(`user.${source.twitch.id}`, source);
    data(`user.${target.twitch.id}`, target);
    return [0, "boosted this user"];
}