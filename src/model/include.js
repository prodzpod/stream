const WebSocket = require('ws');
const path = require('path');
const { spawn, exec } = require('node:child_process');
const { unentry, safeAssign, WASD } = require('../@main/util_client');
const { streamInfo, sendClient, getSocketsServer } = require('../@main/include');
module.exports.ID = "model"
module.exports.log = (...stuff) => console.log('[MODEL]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[MODEL]', ...stuff);
module.exports.error = (...stuff) => console.error('[MODEL]', ...stuff);
module.exports.wss = new WebSocket.Server({ port: 449 }); 
let overlay, capture;
let sockets = {}, objects = {}, newObjects = {};
module.exports.init = async () => {
    objects = {};
    setInterval(() => {
        if (Object.keys(newObjects).length === 0) return;
        for (let d of require('../web/api_client/WS/screen').allSockets()) {
            if (d.ws?.readyState !== 1) continue;
            d.ws.send(WASD.pack('update', JSON.stringify(newObjects)));
        }
        for (let k in newObjects) objects[k] = safeAssign(objects[k], newObjects[k]);
        newObjects = {};
    }, 100);
    setInterval(() => { getSocketsServer('model')?.send(WASD.pack('model', 0, 'sync')); }, 60000);
    this.wss.on('connection', ws => {
        ws.on('message', messages => {
            let args = WASD.unpack(messages);
            // this.log("Recieved 449:", args);
            switch (args[2]) {
                case "register":
                    onSpawned(args[3], ws);
                    break;
                case "update":
                    let data = unentry(args[3].split('&').map(x => x.split('=')));
                    onUpdate(data.name, data.ws, unentry(Object.entries(data).filter(x => x[0] != "name")));
                    break;
                case "destroy":
                    onDestroyed(args[3], ws);
                    break;
            }
        });
    });
};
module.exports.sync = (l, update = true) => {
    let toAdd = l.filter(x => !Object.keys(objects).includes(x));
    let toRemove = Object.keys(objects).filter(x => !l.includes(x));
    for (let k of toAdd) onSpawned(k, null);
    for (let k of toRemove) onDestroyed(k, null);
    for (let d of require('../web/api_client/WS/screen').allSockets()) {
        if (d.ws?.readyState !== 1) continue;
        d.ws.send(WASD.pack('sync', JSON.stringify(Object.keys(objects)), update));
    }
}
module.exports.off = () => {
    this.log("Model is Off");
    for (let k in objects) onDestroyed(k, sockets[k]);
}

function onSpawned(name, ws) {
    module.exports.log("Spawned " + name);
    if (ws) sockets[name] = ws;
    if (!objects[name]) objects[name] = { name: name, x: 0, y: 0, w: 0, h: 0, a: 0 };
    switch (name) {
        case "_phase":
            ws?.send(WASD.pack('set', streamInfo().phase?.toString().padStart(2, '0')));
            break;
        case "_theme":
            ws?.send(WASD.pack('set', streamInfo().subject?.toString()));
            break;
    }
}
function onUpdate(name, ws, data) {
    if (ws) sockets[name] = ws;
    newObjects[name] = safeAssign(newObjects[name], data);
}
function onDestroyed(name, ws) {
    module.exports.log("Destroyed " + name);
    switch (name) {
        case "startingsoon":
        case "brb":
            sendClient('main', 'obs', 'unbrb');
            break;
    }
    delete sockets[name];
    delete objects[name];
    delete newObjects[name];
}

module.exports.objects = () => objects;
module.exports.sockets = () => sockets;
module.exports.send = (name, str) => {
    if (!objects[name]) return false;
    objects[name].ws.send(str);
    return true;
}
module.exports.startOverlay = async () => {
    this.log("Loading Stream Overlay");
    this.log(path.join(__dirname, '../ProdModel.sln'));
    overlay = exec(path.join(__dirname, '../ProdModel.sln'));
    overlay.unref();
    this.log("Loaded Stream Overlay");
    return 0;
}
let i = 0;
module.exports.startTracker = async () => {
    this.log("Loading Face Tracker");
    capture = spawn('python', [path.join(__dirname, 'lib/OpenSeeFace/facetracker.py')]);
    capture.stdout.on('data', x => {
        i++;
        if (i % 1000 == 0) this.log("Tracker Heartbeat", x.toString().slice(0, 10));
    });
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