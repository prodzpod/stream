const { log, warn, error } = require('../include');
module.exports.condition = 'reload_client'
module.exports.execute = async args => {
    log('Restarting Clientside')
    await require('../../@main/features/reload').reload([__dirname, '..', 'api_client'], args?.[1]);
    require('../../@main/util_server').reload(__dirname, '../../@main/util_client');
    return 0;
}