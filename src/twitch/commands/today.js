const { send, log, warn, error } = require('../include');
const { streamInfo } = require('../../@main/include');
module.exports.condition = '!today'
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    let sub = streamInfo().subject;
    send(sub ? `today we're making [${sub}]!` : 'prod is currently offline, check out https://prod.kr/v in the meantime!', user, data);
    return 0;
}