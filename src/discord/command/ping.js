const { apps } = require("../app");
const { BOT_ID } = require("../common");

module.exports.execute = async () => {
    await apps[0].users.fetch(BOT_ID);
    return [0, "pong"];
}