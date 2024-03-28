const { send, commands } = require('../include');
const { measureStart, measureEnd } = require('../../@main/util_server');
const { takeWord, isNullish, safeAssign } = require('../../@main/util_client');
const { cmpAuth } = require('../../web/main');
module.exports.condition = '!restart'
module.exports.permission = false
module.exports.execute = async (message, user, data) => {
    let x = await require('../../@main/features/reload').reload(__dirname, takeWord(message)[1]).catch(console.error);
    if (!isNullish(x)) safeAssign(commands, x); 
    await require('../main').init(await cmpAuth());
    return 0;
}