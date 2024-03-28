const { ID, log, warn, error } = require('../include');
const { sendClient } = require('../../@main/include');
const { takeWord } = require('../../@main/util_client');
module.exports.condition = '!golive'
module.exports.permission = false
module.exports.execute = async (message, user, data) => {
    let [_, content] = takeWord(message);
    sendClient(ID, 'main', `startstream ${content}`);
    return 0;
}