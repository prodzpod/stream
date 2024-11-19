const { src } = require("../..");
const { log } = require("../../commonServer");

module.exports.execute = async (o) => {
    return await src().chat.message(
        "discord", 
        o.chatter, 
        { discord: { id: o.message.id, channel: o.message.channel }}, 
        o.message.text ?? "",
        o.message.emotes,
        o.reply ? { discord: { id: o.reply.id }, fallback: o.reply.name } : null);
}