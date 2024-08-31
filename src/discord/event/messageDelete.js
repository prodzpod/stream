const { SERVER } = require("../common");
const { send } = require("../ws");

module.exports.execute = async (apps, message) => {
    if (message.guildId !== SERVER) return;
    send("delete", message.id);
}