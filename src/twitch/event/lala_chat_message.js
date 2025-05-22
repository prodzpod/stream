const { STREAMER_ID, LALA_ID, WASD } = require("../common");
const { send } = require("../ws")

const clonkCommands = ["!help", "!today", "!discord", "!lore"];

module.exports.execute = async req => {
    let text = "", emotes = [];
    let cheermotes = null;
    for (let x of req.message.fragments) switch (x.type) {
        case "text": text += x.text; break;
        case "mention": text += `<@${x.mention.user_name}:${x.mention.user_id}>`; break;
        case "emote": 
            emotes.push({
                position: text.length,
                name: WASD.toString(x.text),
                url: `https://static-cdn.jtvnw.net/emoticons/v2/${x.emote.id}/default/dark/2.0`,
                source: "twitch",
                format: x.emote.format.includes("animated") ? "gif" : "png"
            });
            break;
        case "cheermote": 
            if (cheermotes === null) cheermotes = await require("../command/cheermote").execute(LALA_ID);
            emotes.push({
                position: text.length,
                name: WASD.toString(x.cheermote.prefix + x.cheermote.bits),
                url: cheermotes[x.cheermote.prefix][x.cheermote.tier].url ?? "",
                source: "twitch",
                format: cheermotes[x.cheermote.prefix][x.cheermote.tier].format
            });
            break;
    }
    if (req.chatter_user_id == STREAMER_ID && req.message.text.startsWith("!") && clonkCommands.every(x => !x.includes(req.message.text))) send("chat", {
        chatter: { id: req.chatter_user_id, name: req.chatter_user_name, color: req.color ?? "#000000" },
        message: { id: req.message_id, text: req.message.text, channel: LALA_ID, emotes: [] },
    });
    else send("clonkchat", req.message.text, req.chatter_user_name, LALA_ID, req.chatter_user_id, req.message_id, { text: text, emotes: emotes });
}