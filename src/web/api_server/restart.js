const { extern } = require('../../@main/include');
const { reload } = require('../../@main/util_server');
const { log, warn, error } = require('../include');
module.exports.condition = 'restart'
module.exports.execute = async () => {
    log('Restarting Web Server');
    await reload(__dirname, '../../@main/util_client.js');
    return await require('../main').init(extern);
}