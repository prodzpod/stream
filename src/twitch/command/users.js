const { fetch } = require("../api");
const { STREAMER_ID } = require("../common");
const { log } = require("../ws");

module.exports.execute = async channel => {
    let ret = [];
    let q = {broadcaster_id: channel, moderator_id: STREAMER_ID};
    while (true) {
        const res = await fetch("GET", "chat/chatters", q);
        if (res[0] !== 200) return [-1, res];
        ret = [...ret, ...res[1].data];
        if (res[1].total >= 100 && res[1].pagination?.cursor) q.after = res[1].pagination.cursor;
        else break;
    }
    return [0, ret.map(x => x.user_id)];
}