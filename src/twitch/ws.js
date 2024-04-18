const WebSocket = require('ws');
const { ID, log, warn, error, onMessage, validate } = require('./include');
const { sendClient, socketsClient, getSocketsServer } = require('../@main/include')
const { waitList } = require('../@main/util_server')
const { takeWord, unentry, WASD } = require('../@main/util_client');
let ws, interval = undefined;
module.exports.init = () => {
    interval = setInterval(async () => {
        log("Validation Attempt");
        if (await validate()) return log("Validation Successful, Continuing");
        else {
            log("Validation Failed, Restarting Twitch");
            require('./commands/restart').execute();
        }
    }, 300000);
    return new Promise(resolve => {
        if (ws) ws.terminate();
        ws = new WebSocket('ws://localhost:339');
        ws.on('open', () => { log('WebSocket Connected'); sendClient(ws, ID, 'register', ID, () => {
            log('Twitch WebSocket Set Up.');
            socketsClient.twitch = ws;
            resolve(0);
        }); });
        ws.on('message', message => { // to id user@s=3;a=z;s=g cmd args
            let args = WASD.unpack(message);
            if (args[2].toLowerCase() === 'respond') {
                if (waitList[ID][args[1]]) {
                    console.log(`[API: ${args[1]}]`, 'Fulfilling Callback');
                    waitList[ID][args[1]](args[3]);
                    delete waitList[ID][args[1]];
                } else console.warn(`[API: ${args[1]}]`, 'Callback is Missing, skipping');
            }
            else if (args[2].toLowerCase() === 'log') console.log(`[API: ${args[1]}]`, takeWord(message, 4)[3]);
            else {
                let [username, tags] = args[2].split("@");
                if (tags) tags = unentry(tags.split(';').map(x => x.split('='))); else tags = {};
                if (username.startsWith('#')) tags.fromDiscord = true;
                if (!username.startsWith('##')) tags.logged = true;
                onMessage(username, tags, args[3]).then(ret => {
                    if (ret !== undefined) getSocketsServer(args[0])?.send(WASD.pack(ID, args[1], 'respond', ret));
                    else delete waitList[args[0]]?.[args[1]];
                });
            }
        });
        ws.on('close', (c, r) => warn('WebSocket Disconnected', c, r));
    });
}

module.exports.reset = () => {
    if (interval) clearInterval(interval);
}