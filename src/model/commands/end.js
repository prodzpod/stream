const { log, warn, error, endTracker } = require('../include');

module.exports.condition = 'end' 
module.exports.execute = async _ => {
    return await this.tracker();
}
module.exports.tracker = async () => {
    log('Stopping Tracker');
    endTracker();
}