const { send, log, warn, error } = require('../include');
module.exports.condition = '!test'
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    send("https://prod.kr/v", user, data);
    return 0;
}