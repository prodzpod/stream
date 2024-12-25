const { send } = require("../..");

module.exports.predicate = ["!rawdata", "!takeout", "!backup", "!mydata", "!data"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    _reply(`download your data at https://prod.kr/data/user/${chatter.twitch.id}.wasd`);
    return [0, true];
}