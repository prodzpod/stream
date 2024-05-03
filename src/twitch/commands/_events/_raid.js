const { getSocketsServer, data } = require('../../../@main/include');
const { WASD, isNullOrWhitespace } = require('../../../@main/util_client');
const { toModelURL } = require('../../../@main/util_server');
const { send, log, warn, error, ID } = require('../../include');
module.exports.condition = '!!raid'
module.exports.permission = (_, __, d) => d['msg-id'] == 'raid';
module.exports.execute = async (args, _user, _data) => {
    let user = isNullOrWhitespace(args[1]) ? _user : args[1];
    let viewer = Number(data['msg-param-viewerCount'] ?? args[2]);
    let url = data().user[user].profile_image
    getSocketsServer('model')?.send(WASD.pack(ID, 0, 'raid', user, viewer, toModelURL(url)));
    return 0;
}