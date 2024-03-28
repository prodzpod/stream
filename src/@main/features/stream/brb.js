const { log, warn, error } = require("../../include");

module.exports.condition = 'brb'
module.exports.execute = async _ => {
    log('============');
    log('TOGGLING BRB');
    log('============');
    return 0;
}