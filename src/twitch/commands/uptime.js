const { send, log, warn, error } = require('../include');
const { streamInfo } = require('../../@main/include');
module.exports.condition = '!uptime'
module.exports.permission = true
module.exports.execute = async (message, user, data) => {
    let time = new Date(new Date().getTime() - streamInfo().start);
    send(`We've been going for ${time.getUTCHours()}:${time.getUTCMinutes()}:${time.getUTCSeconds()}!`, user, data);
    return 0;
}