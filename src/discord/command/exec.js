const { apps, reactionRoleMessage, generalChannel, addRole, removeRole } = require("../app");
const { info, log, warn, error, debug, verbose } = require("../ws");
const { WASD, Math, listFiles, path, measureStart, measureEnd, BOT_ID, BOT2_ID, IRC_ID, SERVER, SERVER_EMOTES, CHANNEL_ANNOUNCEMENT, CHANNEL_GENERAL, CHANNEL_CIRCLE, MESSAGE_ROLE, ROLE_CIRCLE } = require("../common");
const fs = require("fs");

module.exports.execute = async (text) => {
    let app = apps()[0];
    try {
        let ret = eval(text);
        if (ret instanceof Promise) ret = await ret;
        if (typeof ret === "object") ret = WASD.pack(ret);
        return [0, ret];
    } catch (e) {
        return [-1, e];
    }
}