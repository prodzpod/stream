const { send, log, warn, error } = require('../../include');
module.exports.condition = ['!help', '!commands', '!command', '!lore']
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    send("https://prod.kr/v/lore", user, data);
    return 0;
}