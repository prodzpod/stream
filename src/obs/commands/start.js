const { log, warn, error } = require('../include');
const { isNullish } = require('../../@main/util_client');
module.exports.condition = 'start';
module.exports.execute = args => {
    log('Starting OBS client');
    return require('../include').startOBS(!isNullish(args?.[1]));
}