const { send, log, warn, error } = require('../../include');
module.exports.condition = '!discord'
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    send("https://prod.kr/discord", user, data);
    return 0;
}