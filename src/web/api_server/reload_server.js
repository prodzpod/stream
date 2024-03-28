const { takeWord, safeAssign } = require('../../@main/util_client');
const { log, warn, error } = require('../include');
const { commands } = require('../include');
module.exports.condition = 'reload_server'
module.exports.execute = async str => {
    log('Restarting Serverside');
    let [_, k] = takeWord(str);
    let res = await require('../../@main/features/reload').reload([__dirname, '..', 'api_server'], k);
    if (res) safeAssign(commands, res);
    return 0;
}