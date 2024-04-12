const { log, warn, error, sendClient, updateLive, ID } = require("../../include");

module.exports.condition = 'endstream'
module.exports.execute = async _ => {
    log('======================');
    log('ENDING STREAM SEQUENCE');
    log('======================');
    updateLive({
        title: '🌟𝙋𝙕𝙋𝘿🌙 Currently Offline',
        subject: null,
        category: 'Software and Game Development',
        start: -1,
        phase: -1
    });
    require('../../../model/commands/end').execute();
    sendClient(ID, 'obs', 'endstream');
    return 0;
}