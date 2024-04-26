const { log, warn, error, ID } = require('../include');
const { send } = require('../../discord/include');
const { sendClient } = require('../../@main/include');
module.exports.condition = (args, user, data) => user != 'prodzbot' && !args[0].startsWith('!');
module.exports.permission = true;
module.exports.execute = async (_, user, data, message) => {
    send(`\`@${user}\`: ${message}`);
    sendClient(ID, "main", "chat", user, message, data.color ?? '#000000');
    return 0;
}