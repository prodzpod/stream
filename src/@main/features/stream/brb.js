const { log, warn, error, getSocketsServer, sendClient, ID } = require("../../include");

module.exports.condition = 'brb'
module.exports.execute = async _ => {
    log('============');
    log('TOGGLING BRB');
    log('============');
    sendClient(ID, 'obs', 'brb');
    getSocketsServer('model')?.send(WASD.pack('twitch', 0, 'brb'));
    return 0;
}