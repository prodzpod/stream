const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { waitList, listFiles, measureStart, measureEnd } = require('./util_server');
const { takeWord, safeAssign, traverse } = require('./util_client');
module.exports.ID = 'main';
module.exports.log = (...stuff) => console.log('[MAIN]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[MAIN]', ...stuff);
module.exports.error = (...stuff) => console.error('[MAIN]', ...stuff);
module.exports.socketsServer = {
    main: null,
    discord: null,
    twitch: null,
    model: null,
    obs: null,
    web: null,
    void: null
};
module.exports.socketsClient = {
    main: null,
    discord: null,
    twitch: null,
    model: null,
    obs: null,
    web: null
};
module.exports.getSocketsServer = k => this.socketsServer[k]?.readyState === 1 ? this.socketsServer[k] : null;
module.exports.getSocketsClient = k => this.socketsClient[k]?.readyState === 1 ? this.socketsClient[k] : null;
module.exports.wss = new WebSocket.Server({ port: 339 }); 
module.exports.extern = {};
module.exports.init = () => {
    return new Promise(resolve => {
        this.initializeData().then(() => {
            this.wss.on('connection', ws => {
                this.log('WebSocket Connected');
                ws.on('message', str => {
                    if (typeof str !== 'string') str = str.toString();
                    let [k, id, v] = takeWord(str, 3);
                    let [vn, vc] = takeWord(v);
                    if (vn.toLowerCase() === 'register') { this.socketsServer[vc] = ws; this.log('Module Recognized', vc); this.socketsServer[vc].send(`void ${id} respond Acknowledged`); }
                    else this.getSocketsServer(k)?.send(`${Object.keys(this.socketsServer).find(x => this.socketsServer[x] == ws)} ${id} ${v}`);
                });
            });
            const test = new WebSocket('ws://localhost:339');
            test.on('open', () => {
                this.log('Connected with ws:339');
                this.log('Current Date: ' + new Date().toISOString());
                test.terminate();
            });
            test.on('error', e => {
                this.error('Connection with ws:339 failed', e);
                resolve(1);
            });
            test.on('close', () => resolve(0));
        });
    });
}
module.exports.commands = {};
let id = 0;
module.exports.getID = () => { id = (id + 1) % 0x100000000; return id; };
module.exports.sendServer = (source, target, data, callback) => {
    let id = this.getID().toString();
    if (typeof source === 'string') source = this.socketsServer[source];
    if (source?.readyState === 1) {
        source.send(`${target} ${id} ${data}`);
        if (waitList[source] && callback) waitList[source][id] = callback;
    }
}
module.exports.sendClient = (source, target, data, callback) => {
    let id = this.getID().toString();
    let socket = typeof source === 'string' ? this.socketsClient[source] : source;
    let sourceID = typeof source === 'string' ? source : target;
    if (socket?.readyState === 1) {
        socket.send(`${target} ${id} ${data}`);
        if (waitList[sourceID] && callback) waitList[sourceID][id] = callback;
    }
}
module.exports.onCommand = (key, cmds) => {
    return (str) => {
        //* "${to} ${id} ${command} ${data}"
        let [destination, id, respond, msg] = takeWord(str, 4);
        if (respond.toLowerCase() === 'respond') {
            if (waitList[key]?.[id]) {
                console.log(`[API: ${id}]`, 'Fulfilling Callback');
                waitList[key][id](msg);
                delete waitList[key][id];
            } else console.warn(`[API: ${id}]`, 'Callback is Missing, skipping');
        }
        else if (respond.toLowerCase() === 'log') console.log(`[API: ${id}]`, msg);
        else {
            //* send ${to} ${id} respond ${x}
            let message = takeWord(str, 3)[2];
            Object.values(cmds).filter(x => {
                if (typeof x.condition === 'string') {
                    let [k, _] = takeWord(message);
                    return k.toLowerCase() === x.condition;
                } else return x.condition(message);
            }).map(x => x.execute(message).then(x => {
                if (destination.toLowerCase() === 'void' || x === undefined) {
                    delete waitList[destination]?.[id];
                    return;
                }
                this.sendClient(key, destination, 'respond ' + x);
            }))
        }
        return;
    }
}
let data = {};
let files = [];
module.exports.data = () => data;
module.exports.initializeData = async () => {
    let m = measureStart();
    files = (await listFiles(__dirname, 'data')).map(x => x.slice(0, -('.json'.length)));
    for (let p of files) {
        let t = traverse(data, p.split('/'));
        t[0][t[1]] = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', p + '.json')));
    }
    this.log(`Data Loaded onto Memory, read ${files.length} files, duration: ${measureEnd(m)}ms`);
    return data;
}
module.exports.writeData = (k, obj, force=false) => {
    if (typeof k === 'string') k = k.replace(/\[(\d+)\]/g, '.$1').split(/[\/\\\.]/g).map(x => isNaN(x) ? x : Number(x));
    let t = traverse(data, k);
    // check for identical (no writes needed)
    if ((typeof obj !== 'object' && t[0][t[1]] == obj) || (typeof obj === 'object' && JSON.stringify(t[0][t[1]]) == JSON.stringify(obj))) return t[0][t[1]];
    t[0][t[1]] = safeAssign(t[0][t[1]], obj);
    if (k[0] == 'user' && t[1] == 'point') require('../web/api_client/WS/screen').sockets()[k[1]]?.ws.send(`points ${obj}`);
    let tname = [];
    let found = false;
    for (let ks of k) {
        tname.push(ks);
        if (files.includes(tname.join('/'))) { found = true; break; }
    }
    if (force || found) {
        let segment = traverse(data, tname);
        fs.writeFileSync(path.join(__dirname, 'data', tname.join('/') + '.json'), JSON.stringify(segment[0][segment[1]]));
    }
    return t[0][t[1]];
}
module.exports.incrementData = (k, n) => {
    if (typeof k === 'string') k = k.replace(/\[(\d+)\]/g, '.$1').split(/[\/\\\.]/g).map(x => isNaN(x) ? x : Number(x));
    let t = traverse(data, k);
    t[0][t[1]] ??= 0;
    this.writeData(k, t[0][t[1]] + n);
}
module.exports.getCategory = str => {
    // no rhyme or reason, just thought of stuff i would type scrolling through categories / do not take this as "i will stream this"
    // accepting more alias suggestions
    const ALIASES = {
        'Software and Game Development': ['sgd', 'software', 'gamedev', 'code', 'program', 'coding', 'programming'],
        'Science & Technology': ['st', 'tech', 'science', 'technology'],
        'Just Chatting': ['jc', 'chat', 'yap', 'chatting'],
        'Music': ['composing', 'compose'],
        '!TETR.IO': ['tetris', 'tetr', 'tetrio'],
        'The Stanley Parable: Ultra Deluxe': ['stanley parable', 'the stanley parable'],
        'Mahjong Soul': ['mahjong'],
        'Jackbox Party Packs': ['jackbox'],
        '!Bloons TD 6': ['bloons', 'btd6'],
        '!VRChat': ['vrc', 'vrchat']
    };
    str = (String(str) ?? '').replace(/[- _]/g, ' ').trim().toLowerCase();
    let k = Object.keys(ALIASES).find(x => ALIASES[x].includes(str)) ?? str;
    if (k.startsWith('!')) return k.slice(1);
    return k.split(/[- _]/g).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(' ');
}
let streamInfo = {
    title: '🌟𝙋𝙕𝙋𝘿🌙 Currently Offline',
    subject: null,
    category: 'Software and Game Development',
    start: -1,
    phase: -1
};
module.exports.streamInfo = () => streamInfo;
module.exports.updateLive = async o => {
    this.log("Updating Stream Info");
    safeAssign(streamInfo, o);
    if (o.phase !== undefined) {
        if (o.phase >= 0) fs.writeFileSync(path.join(__dirname, '../../../secret/stream_info.json'), JSON.stringify(streamInfo));
        else fs.rmSync(path.join(__dirname, '../../../secret/stream_info.json'));
    }
    if (this.getSocketsServer('twitch')) {
        const prodID = data.user?.[require('../twitch/include').id]?.['user-id'] ?? '140410053';
        let body = {};
        for (let k in o) switch (k) {
            case 'title':
                body.title = o.title;
                break;
            case 'category':
                try {
                    let catData = JSON.parse(await new Promise(resolve, () => { this.sendServer('void', 'twitch', `api GET games?name=${o.category}`, resolve); }));
                    if (catData.data.length) body.game_id = catData.data[0].id
                } catch {}
                break;
        }
        if (Object.keys(body).length) this.sendServer('void', 'twitch', `api PATCH channels?broadcaster_id=${prodID} ${JSON.stringify(body)}`);
    } else this.warn('updateLive() called without Twitch Module loaded');
    let obj = require('../model/include').objects();
    if (obj.phase) obj.phase.ws.send(`set ${streamInfo.phase.toString().padStart(2, '0')}`);
    if (obj.theme) obj.theme.ws.send(`set "${streamInfo.theme.toString()}"`);
}
module.exports.rejoinInfo = () => {
    streamInfo = fs.readFileSync(path.join(__dirname, '../../../secret/stream_info.json'));
    return 0;
}