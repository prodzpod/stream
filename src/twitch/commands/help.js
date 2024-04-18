const { send, log, warn, error } = require('../include');
module.exports.condition = ['!help', '!commands', '!command']
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    send("current commands: `!help`, `!echo`, `!today`, `!uptime`, `!test`, `!removetriangle [number]`. for who I am, check out https://prod.kr/v !", user, data);
    return 0;
}