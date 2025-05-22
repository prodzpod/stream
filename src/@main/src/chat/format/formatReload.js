const { send, data, src } = require("../../..");
const { unentry } = require("../../../common");
const { listFiles } = require("../../../commonServer");

module.exports.predicate = "!freload";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let count = [];
    for (let f of await listFiles("src/@main/src/chat/format")) 
        if ((await src().reload.execute(() => {}, from, chatter, message, "!reload chat/format/" + f, emote, reply))[0] === 0) count.push(f);
    for (let f of await listFiles("src/@main/src/chat/format")) 
        if ((await src().reload.execute(() => {}, from, chatter, message, "!reload chat/format/" + f, emote, reply))[0] === 0);
    _reply(`Reloaded ${count.length} files!`);
    return [0, count];
}