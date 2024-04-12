const { safeAssign } = require('../../@main/util_client');
const { log, warn, error } = require('../include');
const { commands } = require('../include');
module.exports.condition = 'reload_server'
module.exports.execute = async args => {
    log('Restarting Serverside');
    let res = await require('../../@main/features/reload').reload([__dirname, '..', 'api_server'], args[1]);
    if (res) safeAssign(commands, res);
    return 0;
}