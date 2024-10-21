const { apps, reactionRoleMessage, generalChannel, addRole, removeRole, server } = require("../app");
const { info, log, warn, error, debug, verbose } = require("../ws");
const { WASD, Math, listFiles, path, measureStart, measureEnd, BOT_ID, BOT2_ID, IRC_ID, SERVER, SERVER_EMOTES, CHANNEL_ANNOUNCEMENT, CHANNEL_GENERAL, CHANNEL_CIRCLE, MESSAGE_ROLE, ROLE_CIRCLE } = require("../common");
const fs = require("fs");

module.exports.execute = async () => {
    fs.writeFileSync("./emotes.wasd", "[]");
    let _server = server();
    let emoji = server.emojis.find(_ => true);
    while (emoji) {
        await _server.emojis.delete()
        emoji = server.emojis.find(_ => true);
    }
}