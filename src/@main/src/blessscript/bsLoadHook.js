const { data } = require("../..");
const { split, WASD, unique } = require("../../common");
const { log, listFiles } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!loadhook"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const modules = ["shimeji", "chat", "command", ...unique((await listFiles("src/@main/command")).map(x => split(x, "/", 1)[0]))];
    let _args = args(text);
    if (!modules.includes(_args[0])) { _reply("valid modules: `" + modules.join("`, `") + "`"); return [1, ""]; }
    if (!_args[1]) { _reply("name is empty"); return [1, ""]; }
    const hooks = data().hooks[_args[0]]?.[_args[1]] ?? {};
    let ret = hooks[_args[2] ?? chatter.twitch.id] || hooks[0] || "";
    return [0, ret]; 
}
