const { ID, log, warn, error } = require('../../include');
const { sendClient } = require('../../../@main/include');
module.exports.condition = '!endstream'
module.exports.permission = false
module.exports.execute = async (_, __, ___) => {
    sendClient(ID, 'main', `endstream`);
    return 0;
}