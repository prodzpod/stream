const { src, send, data } = require("../..")

module.exports.execute = async (author, key, value) => {
    let chatter = Object.values(data().user).find(x => x?.twitch?.name === author);
    let res = chatter.shimeji.history[key] ?? 0;
    if (key === "maxstreak") res = Math.max(res, value);
    else if (key === "averagedps") res = value;
    else res += value;
    for (let e of [
        ["maxstreak", 5, "sword", "USER has gained ICON achievement for reaching a 5 streak"],
        ["wins", 100, "sword_shield", "USER has gained ICON achievement for reaching a total of 100 wins"],
        ["raidbosswins", 1, "pillar", "USER has gained ICON achievement for defeating a raid boss"]
    ]) grantAchievement(e[0], e[1], e[2], e[3], chatter, key, res);
    data(`user.${chatter.twitch.id}.shimeji.history.${key}`, res);
    return [0, ""];
}

function grantAchievement(key, requirement, icon, text, chatter, _key, value) {
    if (_key !== key || value < requirement || ("uncommon/" + icon) in chatter.economy.icons) return;
    src().icon.grantType(chatter.twitch.id, "uncommon/" + icon, false);
    send("twitch", "send", null, "[🌙] " + text.replaceAll("USER", chatter.twitch.name).replaceAll("ICON", "uncommon/" + icon), []);
}