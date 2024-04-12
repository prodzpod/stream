const { log, warn, error, startOverlay, endTracker, startTracker } = require('../include');

module.exports.condition = 'start' 
module.exports.execute = async args => {
    if (args?.[1] == null) {
        await this.overlay();
        await this.tracker();
        return 0;
    } else switch (args[1]) {
        case 'overlay':
            return await this.overlay();
        case 'tracker':
            return await this.tracker();
        default:
            warn('invalid module to reload, skipping');
            return 1;
    }
}
module.exports.overlay = async () => {
    log('Starting Overlay');
    return await startOverlay();
}
module.exports.tracker = async () => {
    log('Reloading Tracker');
    endTracker(); return await startTracker();
}