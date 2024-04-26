const { send, ID, log } = require('../include');
const { takeWord, WASD } = require('../../@main/util_client');
module.exports.condition = '!restartmodel'
module.exports.permission = false
module.exports.execute = async (args, user, data, message) => {
    require('../../model/commands/start').execute();
    return 0;
}
