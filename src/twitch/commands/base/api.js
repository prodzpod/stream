const { isNullOrWhitespace } = require('../../../@main/util_client');
const { send, ID, sendAPICall, log } = require('../../include');
module.exports.condition = '!api'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    try { args[3] = JSON.parse(args[3]); } catch { args[4] = args[3]; args[3] = {}; };
    let ret = await sendAPICall(args[1], args[2], {}, args[3]);
    if (!isNullOrWhitespace(args[4])) {
        log("api call:", ret.data?.[0] ? ret.data[0] : ret);
        send('done', user, data);
    } else send(JSON.stringify(ret), user, data);
    // log("api:", args, ret);
    return isNullOrWhitespace(args[4]) ? JSON.stringify(ret) : `{status:"done"}`;
}