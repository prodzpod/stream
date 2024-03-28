const WebSocket = require('ws');
const { ID, log, warn, commands, onCommand, sendClient, socketsClient, extern, sendServer } = require('./include');
const { fileExists } = require('./util_server');
const MODULES = ['discord', 'model', 'obs', 'web'];
let ws;
/*
*  ws:339 Format
*  recieve "${to} ${id} ${command} ${data}" -> return
*  -> send "${from(this)} ${id} respond ${return}"
*  
*  common commands
*  main:log - log under [API]
*  *:respond - respond callback
*/
module.exports.init = (_extern) => {
    return new Promise(resolve => {
        Object.assign(extern, _extern);
        require('./features/reload').execute();
        if (ws) ws.terminate();
        ws = new WebSocket('ws://localhost:339');
        ws.on('open', () => { log('WebSocket Connected'); sendClient(ws, ID, 'register ' + ID, () => {
            socketsClient.main = ws;
            log('Main WebSocket Set Up, Booting up Modules...');
            let promises = [];
            for (let k of MODULES) promises.push(new Promise(resolve => require(`../${k}/include`).init(extern).then(_ => require(`../${k}/main`).init(extern).then(resolve))));
            Promise.all(promises).then(async _ => {
                if (fileExists(__dirname, '../../../secret/stream_info.json')) sendServer(ID, ID, 'rejoin');
                resolve(0);
            });
        }); });
        ws.on('message', onCommand(ID, commands));
        ws.on('close', () => warn('WebSocket Disconnected'));
    });
}