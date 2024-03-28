const WebSocket = require('ws');
const path = require('path');
const { spawn } = require('node:child_process');
const { socketsServer } = require('../@main/include');
const { delay, unentry, takeWord, safeAssign } = require('../@main/util_client');
module.exports.ID = "model"
module.exports.log = (...stuff) => console.log('[MODEL]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[MODEL]', ...stuff);
module.exports.error = (...stuff) => console.error('[MODEL]', ...stuff);
module.exports.wss = new WebSocket.Server({ port: 449 }); 
let overlay, capture;
let objects = {};
module.exports.init = async () => {
    objects = {};
    setInterval(() => {
        for (let d of require('../web/api_client/WS/screen').allSockets()) {
            // this.log("Sending object data to d: ", Object.keys(objects).length, require('../web/api_client/WS/screen').allSockets().length)
            let o = {...objects}
            for (let k in o) {
                o[k] = {...o[k]};
                delete o[k].ws;
            }
            // d?.send(`obj ${JSON.stringify(o)}`);
        }
        objects = {};
    }, 100);
    this.wss.on('connection', ws => {
        ws.on('message', str => {
            if (typeof str !== 'string') str = str.toString();
            [_, __, cmd, raw] = takeWord(str, 4);
            switch (cmd) {
                case "register":
                    this.log("Spawned " + raw);
                    break;
                case "update":
                    let data = unentry(raw.split('&').map(x => x.split('=')));
                    data.ws = ws;
                    objects[data.name] = safeAssign(objects[data.name], data);
                    break;
            }
        });
    });
};
module.exports.objects = () => objects;
module.exports.send = (name, str) => {
    if (!objects[name]) return false;
    objects[name].ws.send(str);
    return true;
}
module.exports.startOverlay = async () => {
    this.log("Loading Stream Overlay");
    overlay = spawn(path.join(__dirname, 'bin/Debug/net7.0-windows/ProdModel.exe'));
    overlay.stdout.on('data', this.log);
    overlay.stderr.on('data', this.error);
    while (socketsServer.model === undefined) await delay();
    this.log("Loaded Stream Overlay");
    return 0;
}
module.exports.endOverlay = () => { 
    if (overlay === undefined) return;
    if (!overlay?.killed) overlay.kill();
    overlay = undefined; 
    socketsServer.model = undefined; 
}
module.exports.startTracker = async () => {
    this.log("Loading Face Tracker");
    capture = spawn('python', [path.join(__dirname, 'lib/OpenSeeFace/facetracker.py')]);
    // capture.stdout.on('data', this.log);
    capture.on('close', x => this.error('Face Tracker Closed', x));
    this.log("Loaded Face Tracker");
    return 0;
}
module.exports.endTracker = () => { 
    if (capture === undefined) return;
    if (!capture?.killed) capture.kill();
    capture = undefined; 
}
module.exports.commands = {};