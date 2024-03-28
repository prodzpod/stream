const { send, log, warn, error } = require('../include');
const { streamInfo } = require('../../@main/include');
module.exports.condition = '!uptime'
module.exports.permission = true
module.exports.execute = async (message, user, data) => {
    let sub = streamInfo().subject;
    send(sub ? `today we're making [${sub}]!` : 'prod is currently offline, check out https://prod.kr/v in the meantime!', user, data);
    return 0;
}