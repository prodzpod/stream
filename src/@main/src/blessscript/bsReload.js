const { send, data, src } = require("../..");
const { unentry } = require("../../common");
const { listFiles } = require("../../commonServer");

module.exports.predicate = "!bsreload";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let count = [];
    for (let f of await listFiles("src/@main/src/blessscript")) 
        if ((await src().reload.execute(() => {}, from, chatter, message, "!reload blessscript/" + f, emote, reply))[0] === 0) count.push(f);
    for (let f of await listFiles("src/@main/src/blessscript")) 
        if ((await src().reload.execute(() => {}, from, chatter, message, "!reload blessscript/" + f, emote, reply))[0] === 0);
    _reply(`Reloaded ${count.length} files!`);
    return [0, count];
}