const WebSocket = require('ws');
const { ID, log, warn, error, onMessage } = require('./include');
const { sendClient, socketsClient } = require('../@main/include')
const { waitList } = require('../@main/util_server')
const { takeWord, unentry } = require('../@main/util_client');
let ws;
module.exports.init = () => {
    return new Promise(resolve => {
        if (ws) ws.terminate();
        ws = new WebSocket('ws://localhost:339');
        ws.on('open', () => { log('WebSocket Connected'); sendClient(ws, ID, 'register ' + ID, () => {
            log('Twitch WebSocket Set Up.');
            socketsClient.twitch = ws;
            resolve(0);
        }); });
        ws.on('message', str => { // to id user@s=3;a=z;s=g cmd args
            let [destination, id, respond, msg] = takeWord(str, 4);
            if (respond.toLowerCase() === 'respond') {
                log(waitList);
                if (waitList[ID][id]) {
                    console.log(`[API: ${id}]`, 'Fulfilling Callback');
                    waitList[ID][id](msg);
                    delete waitList[ID][id];
                } else console.warn(`[API: ${id}]`, 'Callback is Missing, skipping');
            }
            else if (respond.toLowerCase() === 'log') console.log(`[API: ${id}]`, msg);
            else {
                let [username, tags] = respond.split("@");
                if (tags) tags = unentry(tags.split(';').map(x => x.split('='))); else tags = {};
                if (username.startsWith('#')) tags.fromDiscord = true;
                if (!username.startsWith('##')) tags.logged = true;
                onMessage(username, tags, msg).then(ret => {
                    if (ret !== undefined) sendClient(ID, destination, 'respond ' + id + ' ' + ret);
                    else delete waitList[destination]?.[id];
                });
            }
        });
        ws.on('close', (c, r) => warn('WebSocket Disconnected', c, r));
    });
}