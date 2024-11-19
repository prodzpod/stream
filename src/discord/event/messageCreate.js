const { IRC_ID, SERVER, WASD } = require("../common");
const { send, log } = require("../ws");

module.exports.execute = async (apps, msg) => {
    if (msg.type !== 0 || msg.guildId !== SERVER || (msg.author.bot && msg.author.id !== IRC_ID)) return;
    let ret = {
        chatter: {},
        message: { id: msg.id, channel: msg.channelId, emotes: [] },
    };
    if (msg.author.bot) {
        ret.chatter.irc = {};
        [_, ret.chatter.irc.name, ret.message.text] = msg.content.match(/`<([^>]+)>` (.+)/);
        [ret.message.text, ret.message.emotes] = await handleEmotes(apps[0], ret.message.text);
        ret.chatter.irc.id = ret.chatter.irc.name;
    } else {
        ret.chatter.discord = {};
        ret.chatter.discord.id = msg.author.id;
        ret.chatter.discord.name = msg.member?.nickname ?? msg.author.tag;
        ret.chatter.discord.profile_image = msg.author.avatarURL();
        [ret.message.text, ret.message.emotes] = await handleEmotes(apps[0], msg.content);
        ret.message.text += [...Array.from(msg.stickers.values()), ...Array.from(msg.attachments.values())].map(x => "\n" + x.url).join("");
    }
    if (msg.reference) {
        const reply = await msg.channel.messages.fetch(msg.reference.messageId);
        let text, emotes = await handleEmotes(apps[0], reply.content);
        ret.reply = { id: reply.id, text: WASD.toString(text), emotes: emotes, user: reply.author.id, name: reply.member?.nickname ?? reply.author.tag }
    }
    ret.message.text = WASD.toString(ret.message.text);
    send("chat", ret);
}

async function handleEmotes(app, str) {
    // member
    let temp = "";
    let x = /<@\d+>/.exec(str);
    while (x) {
        temp += str.slice(0, x.index);
        let id = x[0].slice(2, -1);
        let member = await (await app.guilds.fetch(SERVER)).members.fetch(id);
        temp += `<@${(member.nickname ?? member.user.displayName ?? member.user.tag).replaceAll(":", "").replaceAll(">", "")}:${id}>`;
        str = str.slice(x.index + x[0].length);
        x = /<@\d+>/.exec(str);
    }
    str = temp + str;
    // roles
    temp = "";
    x = /<@&\d+>/.exec(str);
    while (x) {
        temp += str.slice(0, x.index);
        let id = x[0].slice(3, -1);
        let role = await (await app.guilds.fetch(SERVER)).roles.fetch(id);
        temp += `@${role.name}`;
        str = str.slice(x.index + x[0].length);
        x = /<@&\d+>/.exec(str);
    }
    str = temp + str;
    // channel
    temp = "";
    x = /<#\d+>/.exec(str);
    while (x) {
        temp += str.slice(0, x.index);
        let id = x[0].slice(2, -1);
        let channel = await (await app.guilds.fetch(SERVER)).channels.fetch(id);
        temp += `#${channel.name}`;
        str = str.slice(x.index + x[0].length);
        x = /<#\d+>/.exec(str);
    }
    str = temp + str;
    // emotes
    let ret = "";
    let emotes = [];
    x = /<(a?):(\w+):(\d+)>/.exec(str);
    while (x) {
        emotes.push({
            position: ret.length + x.index,
            name: WASD.toString(x[2]),
            url: `https://cdn.discordapp.com/emojis/${x[3]}.${x[1] === "a" ? "gif?quality=lossless" : "png"}`,
            source: "discord",
            format: x[1] === "a" ? "gif" : "png"
        });
        ret += str.slice(0, x.index);
        str = str.slice(x.index + x[0].length);
        x = /<(a?):(\w+):(\d+)>/.exec(str);
    }
    return [ret + str, emotes];
}