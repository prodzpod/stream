const { send, log, warn, error } = require('../../include');
module.exports.condition = ['!screen']
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    send("https://prod.kr/v/screen", user, data);
    return 0;
}