const { send, commands } = require('../include');
const { measureStart, measureEnd } = require('../../@main/util_server');
const { takeWord, isNullish, safeAssign } = require('../../@main/util_client');
module.exports.condition = '!reload'
module.exports.permission = false
module.exports.execute = async (message, user, data) => {
    let m = measureStart();
    let x = await require('../../@main/features/reload').reload(__dirname, takeWord(message)[1]).catch(console.error);
    if (!isNullish(x)) safeAssign(commands, x); 
    let ks = Object.keys(x);
    send((ks.length === 1 ? `Reloaded ${ks[0]}!` : `Reloaded ${ks.length} files!`) + ` Duration: ${measureEnd(m)}ms`, user, data);
    return 0;
}