const { data } = require("../..");
const { log } = require("../../commonServer");

module.exports.identify = chatter => {
    const category = Object.keys(chatter)[0];
    if (!category) return null;
    return Object.values(data().user ?? {}).find(x => x[category]?.id == chatter[category].id) ?? null;
}
module.exports.register = chatter => {
    if (!chatter.twitch) return;
    data(`user.${chatter.twitch.id}`, chatter);
}