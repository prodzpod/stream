const { takeWord } = require('../../@main/util_client');
const { log, warn, error } = require('../include');
module.exports.condition = 'reload_client'
module.exports.execute = async str => {
    log('Restarting Clientside')
    let [_, k] = takeWord(str);
    await require('../../@main/features/reload').reload([__dirname, '..', 'api_client'], k);
    require('../../@main/util_server').reload(__dirname, '../../@main/util_client');
    return 0;
}