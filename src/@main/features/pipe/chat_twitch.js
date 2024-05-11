const { sendClient, ID, log } = require("../../include");
const { isNullOrWhitespace } = require("../../util_client");
const { fetch, execute } = require("./chat");

module.exports.condition = 'chat_twitch';
module.exports.execute = async args => {
    let [_, user, message, id, reply, color] = args;
    let reply_id = null;
    if (!isNullOrWhitespace(reply)) reply_id = fetch('twitch', reply)?.discord;
    let discord_id = await new Promise(resolve => sendClient(ID, 'discord', 'send', message, user, reply_id, x => resolve(x)));
    execute([null, user, message, color, {twitch: id, discord: discord_id}]);
}