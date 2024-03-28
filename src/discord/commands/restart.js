const { takeWord, safeAssign } = require('../../@main/util_client');
const { commands, log, warn, error } = require('../include');
module.exports.condition = 'start'
module.exports.execute = async str => {
    log('Restarting Discord Bot');
    require('../include').init();
    return 0;
}