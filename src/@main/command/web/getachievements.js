const { src, data } = require("../..");
const { log } = require("../../commonServer");
module.exports.execute = async () => {
    let ret = {};
    for (const user of Object.values(data().user)
        .filter(x => x?.twitch?.id && x?.economy?.icons)
        .map(x => [x.twitch.name, Object.keys(x.economy.icons).filter(y => y.startsWith("uncommon/") || y.startsWith("quest/"))])
        .filter(x => x[1].length)) for (const k of user[1]) { ret[k] ??= []; ret[k].push(user[0]); }
    return [0, ret];
}