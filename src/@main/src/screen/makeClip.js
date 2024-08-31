const { send, src } = require("../..");
const { delay } = require("../../common");
const { info, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!makeclip";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    let user = await send("twitch", "user", _args[0] ?? "prodzpod");
    let post = await send("twitch", "remote", "POST", "clips", {broadcaster_id: user.id})
    post = post.data?.[0] ?? post ?? {};
    let ret = post;
    if (post.id) {
        while (true) {
            ret = (await send("twitch", "remote", "GET", "clips", {id: post.id}));
            if (ret?.data?.length === 0) await delay(5000);
            else { ret = ret.data?.[0] ?? ret ?? {}; break; }
        }
        ret.edit_url = post.edit_url;
    }
    return [0, ret];
}
