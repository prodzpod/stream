const { ID, log, warn, error } = require('../include');
const { sendClient } = require('../../@main/include');
module.exports.condition = '!golive'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    sendClient(ID, 'main', 'startstream', ...args.slice(1));
    return 0;
}