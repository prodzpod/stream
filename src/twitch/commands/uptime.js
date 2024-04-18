const { send, log, warn, error } = require('../include');
const { streamInfo } = require('../../@main/include');
module.exports.condition = '!uptime'
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    let start = streamInfo().start;
    let time = new Date(new Date().getTime() - start);
    send(start == -1 ? `Stream has not started yet! We go live at *Every Thursday 3+1PM EST* (3 in est, 4 in edt, <t:72000:t> in discord).` : `We've been going for ${time.getUTCHours()}:${time.getUTCMinutes()}:${time.getUTCSeconds()}!`, user, data);
    return 0;
}