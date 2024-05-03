const { ID, log, warn, error } = require('../../include');
const { sendClient, streamInfo } = require('../../../@main/include');
const { takeWord } = require('../../../@main/util_client');
module.exports.condition = '!marker'
module.exports.permission = false
module.exports.execute = async (args, user, data) => {
    sendClient(ID, 'main', 'marker', ...args.slice(1));
    return 0;
}