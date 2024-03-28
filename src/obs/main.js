const path = require('path');
const WebSocket = require('ws');
const { ID, log, warn, error, commands } = require('./include');
const { onCommand, sendClient, socketsClient } = require('../@main/include');
const { isNullish, safeAssign } = require('../@main/util_client');
let ws;
module.exports.init = async () => {
    return new Promise(resolve => {
        require('../@main/features/reload').reload(path.join(__dirname, 'commands')).then(x => { if (!isNullish(x)) safeAssign(commands, x); });
        if (ws) ws.terminate();
        ws = new WebSocket('ws://localhost:339');
        ws.on('open', () => { log('WebSocket Connected'); sendClient(ws, ID, 'register ' + ID, () => {
            log('OBS Module Loaded');
            socketsClient.obs = ws;
            resolve(0);
        }); });
        ws.on('message', onCommand(ID, commands));
        ws.on('close', () => warn('WebSocket Disconnected'));
    });
}