const { apps, handleEmotes } = require("../app");
const { CHANNEL_GENERAL } = require("../common");

let useApp2 = false, lastUser = null;
module.exports.execute = async (channel, message, emote, reply) => {
    channel ??= CHANNEL_GENERAL; message = await handleEmotes((message?.toString() ?? "").trim(), emote); if (message === "") message = "** **";
    const chatUser = message.match(/^`<@(\w+)>`:/)?.[1];
    if (chatUser) message = message.replaceAll("@everyone", "**@**everyone").replaceAll("@here", "**@**here");
    if (chatUser && lastUser !== chatUser) { lastUser = chatUser; useApp2 = !useApp2; }
    const app = apps()[chatUser ? (useApp2 ? 1 : 0) : 0];
    if (!app || !app.channels) return [1, ""];
    message = message.slice(0, 2000);
    const ret = await (reply ? 
        (await (await app.channels.fetch(channel)).messages.fetch(reply))?.reply(message) :
        (await app.channels.fetch(channel))?.send(message)
    );
    return [0, { id: ret?.id, channel: ret?.channelId }];
}