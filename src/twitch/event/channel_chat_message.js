const { STREAMER_ID, WASD } = require("../common");
const { send, log } = require("../ws")

module.exports.execute = async req => {
    let ret = {
        chatter: { id: req.chatter_user_id, name: req.chatter_user_name, color: req.color ?? "#000000" },
        message: { id: req.message_id, channel: req.broadcaster_user_id, emotes: [] },
    };
    ret.chatter.badges = req.badges.map(x => `${x.set_id}-${x.id}`);
    if (req.reply) {
        ret.reply = { id: req.reply.parent_message_id, user: req.reply.parent_user_id, name: req.reply.parent_user_name };
        req.message.fragments.splice(req.message.fragments.findIndex(x => x.type === "mention"), 1);
    }
    ret.message.text = "";
    let cheermotes = null;
    for (let x of req.message.fragments) switch (x.type) {
        case "text": ret.message.text += x.text; break;
        case "mention": ret.message.text += `<@${x.mention.user_name}:${x.mention.user_id}>`; break;
        case "emote": 
            ret.message.emotes.push({
                position: ret.message.text.length,
                name: WASD.toString(x.text),
                url: `https://static-cdn.jtvnw.net/emoticons/v2/${x.emote.id}/default/dark/2.0`,
                source: "twitch",
                format: x.emote.format.includes("animated") ? "gif" : "png"
            });
            break;
        case "cheermote": 
            if (cheermotes === null) cheermotes = await require("../command/cheermote").execute(STREAMER_ID);
            ret.message.emotes.push({
                position: ret.message.text.length,
                name: WASD.toString(x.cheermote.prefix + x.cheermote.bits),
                url: cheermotes[x.cheermote.prefix][x.cheermote.tier].url ?? "",
                source: "twitch",
                format: cheermotes[x.cheermote.prefix][x.cheermote.tier].format
            });
            break;
    }
    ret.message.text = WASD.toString(ret.message.text);
    if (req.channel_points_custom_reward_id) req.redeem = req.channel_points_custom_reward_id;
    if (req.chatter_user_id === STREAMER_ID && (req.message.text.startsWith("[🌙]") || req.message.text.startsWith("@"))) return;
    send("chat", ret);
}