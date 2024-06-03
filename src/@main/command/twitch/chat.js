const { src } = require("../..");

module.exports.execute = async (o) => {
    return await src().chat.message(
        "twitch", 
        { twitch: o.chatter }, 
        { twitch: { id: o.message.id, channel: o.message.channel }}, 
        o.message.text,
        o.reply ? { twitch: { id: o.reply.id }, fallback: o.reply.name } : null);
}