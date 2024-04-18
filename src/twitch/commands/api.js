const { isNullOrWhitespace } = require('../../@main/util_client');
const { send, ID, sendAPICall, log } = require('../include');
module.exports.condition = '!api'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    try { args[3] = JSON.parse(args[3]); } catch { args[3] = undefined; };
    let ret = await sendAPICall(args[1], args[2], {}, args[3]);
    if (isNullOrWhitespace(args[4])) log(ret);
    return isNullOrWhitespace(args[4]) ? "done" : JSON.stringify(ret);
}