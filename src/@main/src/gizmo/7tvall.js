const { data, src } = require("../..");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!7tvall";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text) => {
    const _args = args(text);
    let id = _args[0].split("/").at(-1);
    let res = await (await fetch(`https://7tv.io/v3/emote-sets/${id}`)).json();
    log("Loading all emotes from", res.name);
    let ret = data().emote["7tv"];
    let count = 0;
    for (let e of res.emotes) {
        let file = e.data.host.files.find(x => x.format === "WEBP") ?? e.data.host.files[0];
        let res = await src()["7tv"].get(`https:${e.data.host.url}/${file.name}`, e.name, file.format.toLowerCase(), file.frame_count > 1);
        if (res) { ret[res[0]] = res[1]; count++; }
    }
    if (count > 0) data("emote.7tv", ret);
    _reply(`Loaded ${count} emotes from ${res.name}!`);
    return [0, ret];
}