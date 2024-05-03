const { ID, log, warn, error } = require('../../include');
const { sendClient } = require('../../../@main/include');
module.exports.condition = '!brb'
module.exports.permission = false
module.exports.execute = async (_, __, ___) => {
    sendClient(ID, 'main', `brb`);
    return 0;
}