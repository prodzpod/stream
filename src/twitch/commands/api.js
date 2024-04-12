const { send, ID, sendAPICall, log } = require('../include');
module.exports.condition = '!api'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    try { args[3] = JSON.parse(args[3]); } catch { args[3] = undefined; };
    let ret = await sendAPICall(args[1], args[2], {}, args[3]);
    return JSON.stringify(ret);
}