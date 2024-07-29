const { STREAMER_ID } = require("../common");
const { send, log } = require("../ws")

module.exports.execute = req => {
    if (req.broadcaster_user_id !== STREAMER_ID) {
        send("clonkchat", req.message.text, req.chatter_user_name);
        if (req.chatter_user_id !== STREAMER_ID) return;
    }
    let ret = {
        chatter: { id: req.chatter_user_id, name: req.chatter_user_name, color: req.color ?? "#000000" },
        message: { id: req.message_id, channel: req.broadcaster_user_id },
    };
    if (req.broadcaster_user_id === STREAMER_ID) ret.chatter.badges = req.badges.map(x => `${x.set_id}-${x.id}`);
    if (req.reply) {
        ret.reply = { id: req.reply.parent_message_id, user: req.reply.parent_user_id, name: req.reply.parent_user_name };
        req.message.fragments.splice(req.message.fragments.findIndex(x => x.type === "mention"), 1);
    }
    ret.message.text = req.message.fragments.map(x => { switch (x.type) {
        case "text": return x.text;
        case "cheermote": return `<c:${x.cheermote.prefix}:${x.cheermote.bits}>`;
        case "emote": return `<${x.emote.format.includes("animated") ? "a" : ""}:${x.text}:${x.emote.id}>`;
        case "mention": return `<@${x.mention.user_name}:${x.mention.user_id}>`;
    }}).join("");
    if (req.channel_points_custom_reward_id) req.redeem = req.channel_points_custom_reward_id;
    if (req.broadcaster_user_id !== STREAMER_ID && !req.message.text.startsWith("!")) return;
    if (req.broadcaster_user_id === STREAMER_ID && (req.message.text.startsWith("[🌙]") || req.message.text.startsWith("@"))) return;
    send("chat", ret);
}