const { getSocketsServer } = require('../../../@main/include');
const { isNullOrWhitespace, WASD } = require('../../../@main/util_client');
const { toModelURL } = require('../../../@main/util_server');
const { send, log, warn, error, ID } = require('../../include');
module.exports.condition = '!furrowthemareofeidola'
module.exports.permission = true
module.exports.execute = async (args, user, data) => {
    getSocketsServer('model')?.send(WASD.pack(ID, 0, 'idoldream', user, toModelURL(data.profile_image)));
    if (isNullOrWhitespace(args[2])) send("it worked", user, data);
    return "it worked";
}