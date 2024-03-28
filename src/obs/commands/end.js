const { log, warn, error } = require('../include');
module.exports.condition = 'end';
module.exports.execute = _ => {
    log('Destroying OBS client');
    return require('../include').endOBS();
}