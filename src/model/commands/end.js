const { isNullish, takeWord } = require("../../@main/util_client");
const { log, warn, error, endOverlay, endTracker } = require('../include');

module.exports.condition = 'end' 
module.exports.execute = async str => {
    if (isNullish(str)) {
        await this.tracker();
        await this.overlay();
        return 0;
    } else switch (takeWord(str, 3)[1]) {
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
    log('Stopping Overlay');
    endOverlay();
}
module.exports.tracker = async () => {
    log('Stopping Tracker');
    endTracker();
}