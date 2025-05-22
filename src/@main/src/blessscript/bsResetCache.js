const { data, src } = require("../..");
const { split, WASD, unique } = require("../../common");
const { log, listFiles } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!resetcache"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    src().bsReportHook.resetCache();
    _reply("reset cache");
    return [0, "reset cache"]; 
}
