const { randomHex } = require("../../common");
const { log } = require("../../commonServer");
let accounts = {}, logins = {};

module.exports.predicate = ["!genkey", "!generatekey", "!getapikey", "!apikey", "!keygen"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    let id = randomHex(16);
    logins[id] = chatter.twitch.id;
    _reply("click https://prod.kr/api/auth?login=" + id + " to get key");
    return [0, id];
}

module.exports.validate = (login) => {
    if (!logins[login]) return false;
    accounts[login] = logins[login];
    delete logins[login];
    return true;
}

module.exports.getUser = (login) => {
    return accounts[login] ?? false;
}