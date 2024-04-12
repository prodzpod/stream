const { log, warn, error } = require('../include');
module.exports.condition = 'start'
module.exports.execute = async _ => {
    log('Restarting Discord Bot');
    require('../include').init();
    return 0;
}