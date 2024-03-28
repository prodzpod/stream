
const WebSocket = require('ws');
const path = require('path');
const { spawn } = require('node:child_process');
const { delay, randomHex } = require('../@main/util_client');
const { getSocketsServer } = require('../@main/include');
let obs, obsWS, messages = {};
module.exports.ID = 'obs';
module.exports.log = (...stuff) => console.log('[OBS]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[OBS]', ...stuff);
module.exports.error = (...stuff) => console.error('[OBS]', ...stuff);
module.exports.init = async () => 0;
module.exports.startOBS = async () => {
    this.log("Loading OBS");
    obs = spawn(process.env.OBS_PATH, { cwd: path.dirname(process.env.OBS_PATH) });
    obs.stdout.on('data', x => this.log(x.toString()));
    obs.stderr.on('data', x => this.error(x.toString()));
    
    let connected = false;
    this.log('WS Connecting Attempt Begin');
    while (!connected) {
        obsWS = new WebSocket('ws://localhost:4455');
        obsWS.on('open', x => { this.log('WS Connected'); obsWS.send(JSON.stringify({ "op": 1, "d": { "rpcVersion": 1 }})); connected = true; });
        obsWS.on('error', _ => {});
        await delay();
    }
    messages = {};
    obsWS.on('message', str => {
        let evt = JSON.parse(str.toString());
        if (evt.op === 5 && getSocketsServer(this.ID)) getSocketsServer(this.ID).send(`void 0 ${evt.eventType} ${JSON.stringify(evt.eventData)}`);
        if (evt.op === 7 && messages[id]) { messages[id](evt.d); delete messages[id]; }
    });
    this.log("Loaded OBS");
    return 0;
}
module.exports.endOBS = () => { 
    if (obs === undefined) return;
    if (!obs?.killed) obs.kill();
    obs = undefined; 
    obsWS.model = undefined; 
}
module.exports.send = (name, data, fn) => {
    if (obsWS === undefined) return this.warn('OBS WS is not active');
    let id = `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}`;
    messages[id] = fn;
    obsWS.send(JSON.stringify({
        "op": 6,
        "d": {
          "requestType": name,
          "requestId": fn,
          "requestData": data
        }
    }));
    return 0;
}
module.exports.commands = {};