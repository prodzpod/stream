const { apps, reactionRoleMessage, generalChannel, addRole, removeRole, server, emoteServer } = require("../app");
const { info, log, warn, error, debug, verbose } = require("../ws");
const { WASD, Math, listFiles, path, measureStart, measureEnd, BOT_ID, BOT2_ID, IRC_ID, SERVER, SERVER_EMOTES, CHANNEL_ANNOUNCEMENT, CHANNEL_GENERAL, CHANNEL_CIRCLE, MESSAGE_ROLE, ROLE_CIRCLE } = require("../common");
const fs = require("fs");

module.exports.execute = async () => {
    fs.writeFileSync("./emotes.wasd", "[]");
    let emojis = await emoteServer().emojis.fetch();
    for (let emoji of emojis.values()) await emoji.delete();
}