const { fetch } = require("../api");
const { log } = require("../ws");

module.exports.execute = async (accounts) => {
    let results = [];
    for (let i = 0; i < accounts.length; i += 100) {
        let res = await fetch("GET", "streams?first=100&user_id=" + accounts.slice(i, i + 100).join("&user_id="));
        if (res[0] != 200) { return [1, []]; }
        res = res[1].data;
        results.push(...res.map(x => ({
            "login": x.user_login,
            "name": x.user_name,
            "game": x.game_name,
            "title": x.title,
            "thumbnail": x.thumbnail_url
        })));
    }
    return [0, results];
}