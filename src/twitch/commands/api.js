const { send, ID, sendAPICall, log } = require('../include');
const { takeWord, unentry } = require('../../@main/util_client');
module.exports.condition = '!api'
module.exports.permission = false
module.exports.execute = async (message, user, data) => {
    let [_, method, url, body] = takeWord(message, 4);
    let [sub, query] = url.split('?');
    query = query ? unentry(query.split('&').map(x => x.split('='))) : {};
    try { body = JSON.parse(body); } catch { body = undefined; };
    let ret = await sendAPICall(method, sub, query, body);
    send(JSON.stringify(ret), user, data);
    return JSON.stringify(ret);
}