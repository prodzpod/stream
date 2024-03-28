const { log, warn, error } = require('../include');
module.exports.condition = 'start';
module.exports.execute = _ => {
    log('Starting OBS client');
    return require('../include').startOBS();
}