const { send, data } = require("../..");
const { numberish, WASD } = require("../../common");
const { args } = require("../chat/chat");

const PEOPLE_PER_PAGE = 10;
module.exports.predicate = "!clonkspotleaderboard";
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _page = numberish(args(text)[0] ?? ""); let page = 0;
    let users = Object.values(data().user)
        .filter(x => x.clonkspotting?.boost > 0)
        .sort((a, b) => b.clonkspotting.boost - a.clonkspotting.boost);
    if (typeof _page === "number") {
        if (_page > 0 && _page <= Math.ceil(users.length / 10)) page = _page - 1;
    } else if (typeof _page === "string") {
        let idx = users.findIndex(x => x.twitch?.name.toLowerCase() === _page.toLowerCase() || x.twitch?.login.toLowerCase() === _page.toLowerCase());
        if (idx !== -1) page = Math.floor(idx / 10);
    }
    users = users.slice(page * PEOPLE_PER_PAGE, (page + 1) * PEOPLE_PER_PAGE);
    _reply(users.map((x, i) => `${page * PEOPLE_PER_PAGE + 1 + i}. ${x.twitch.name} (${x.clonkspotting.boost})`).join(" \n"));
}