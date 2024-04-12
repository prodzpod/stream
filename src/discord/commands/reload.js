const { safeAssign } = require('../../@main/util_client');
const { commands, log, warn, error } = require('../include');
module.exports.condition = 'reload'
module.exports.execute = async args => {
    let res = await require('../../@main/features/reload').reload([__dirname], args[1]);
    if (res) safeAssign(commands, res);
    return 0;
}