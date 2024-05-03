const { send, commands } = require('../../include');
const { measureStart, measureEnd } = require('../../../@main/util_server');
const { isNullish, safeAssign } = require('../../../@main/util_client');
const path = require('path');
module.exports.condition = '!reload'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    let m = measureStart();
    let x = await require('../../../@main/features/reload').reload(path.join(__dirname, '../'), args[1]).catch(console.error);
    if (!isNullish(x)) {
        safeAssign(commands, x); 
        let ks = Object.keys(x);
        send((ks.length === 1 ? `Reloaded ${ks[0]}!` : `Reloaded ${ks.length} files!`) + ` Duration: ${measureEnd(m)}ms`, user, data);
    } else send(`Invalid Command, duration: ${measureEnd(m)}ms`, user, data);
    return 0;
}