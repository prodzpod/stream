const { IRC_ID, SERVER } = require("../common");
const { send, log } = require("../ws");

module.exports.execute = async (apps, msg) => {
    if (msg.guildId != SERVER || (msg.author.bot && msg.author.id != IRC_ID)) return;
    let ret = {
        chatter: {},
        message: { id: msg.id, channel: msg.channelId },
    };
    if (msg.author.bot) {
        ret.chatter.irc = {};
        [_, ret.chatter.irc.name, ret.message.text] = msg.content.match(/`<([^>]+)>` (.+)/);
        ret.chatter.irc.id = ret.chatter.irc.name;
    } else {
        ret.chatter.discord = {};
        ret.chatter.discord.id = msg.author.id;
        ret.chatter.discord.name = msg.member?.nickname ?? msg.author.tag;
        ret.chatter.discord.profile_image = msg.author.avatarURL();
        ret.message.text = msg.cleanContent + [...Array.from(msg.attachments.values()), ...Array.from(msg.stickers.values())].map(x => "\n" + x.url).join("");
    }
    if (msg.reference) {
        const reply = await msg.channel.messages.fetch(msg.reference.messageId);
        ret.reply = { id: reply.id, text: reply.cleanContent, user: reply.author.id, name: reply.member?.nickname ?? reply.author.tag }
    }
    let processed = [];
    for (const pair of Array.from(msg.content.matchAll(/<a?(:\w+:)\d+>/g))) {
        if (processed.includes(pair[1])) continue;
        ret.message.text = ret.message.text.replaceAll(pair[1], pair[0]);
        processed.push(pair[1]);
    }
    send("chat", ret);
}