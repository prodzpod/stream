
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
module.exports.startOBS = async (_spawn = false) => {
    if (_spawn) {
        this.log("Loading OBS");
        obs = spawn(process.env.OBS_PATH, { cwd: path.dirname(process.env.OBS_PATH) });
        obs.unref();
    }    
    let connected = false;
    this.log('WS Connecting Attempt Begin');
    while (!connected) {
        obsWS = new WebSocket('ws://localhost:4455');
        obsWS.on('open', _ => { this.log('WS Connected'); obsWS.send(JSON.stringify({ "op": 1, "d": { "rpcVersion": 1 }})); connected = true; });
        obsWS.on('error', _ => {});
        await delay();
    }
    messages = {};
    obsWS.on('message', str => {
        let evt = JSON.parse(str.toString());
        if (evt.op === 5 && getSocketsServer(this.ID)) getSocketsServer(this.ID).send(`void 0 ${evt.eventType} ${JSON.stringify(evt.eventData)}`);
        if (evt.op === 7 && messages[evt.d.requestId]) { messages[evt.d.requestId](evt.d); delete messages[evt.d.requestId]; }
    });
    this.log("Loaded OBS");
    return 0;
}
module.exports.send = (name, data, fn) => {
    if (obsWS === undefined) return this.warn('OBS WS is not active');
    let id = `${randomHex(8)}-${randomHex(4)}-${randomHex(4)}-${randomHex(4)}-${randomHex(12)}`;
    messages[id] = fn;
    obsWS.send(JSON.stringify({
        "op": 6,
        "d": {
          "requestType": name,
          "requestId": id,
          "requestData": data
        }
    }));
    return 0;
}
module.exports.sendByName = (name, scene, source, data, fn) => {
    this.send("GetSceneItemId", {
        "sceneName": scene,
        "sourceName": source
    }, d => this.send(name, Object.assign(data, {
        "sceneName": scene,
        "sceneItemId": d.responseData.sceneItemId
    }), fn));
}
module.exports.commands = {};