const { commands, log } = require('../include');
const { isNullish, safeAssign } = require('../../@main/util_client');
const { cmpAuth } = require('../../web/main');
module.exports.condition = '!restart'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    log("RESTART called", args);
    let x = await require('../../@main/features/reload').reload(__dirname, args?.[1]).catch(console.error);
    if (!isNullish(x)) safeAssign(commands, x); 
    let auth = await cmpAuth(true);
    await require('../include').init(auth);
    require('../ws').reset();
    await require('../main').init(auth);
    return 0;
}