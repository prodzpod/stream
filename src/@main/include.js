const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { waitList, listFiles, measureStart, measureEnd, fileExists } = require('./util_server');
const { safeAssign, traverse, WASD, unentry } = require('./util_client');
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
                ws.on('message', args => {
                    args = WASD.unpack(args);
                    // this.log("message recieved:", args, waitList);
                    if (args[2].toLowerCase() == 'register') { 
                        this.socketsServer[args[3]] = ws; 
                        this.log('Module Recognized', args[3]); 
                        this.socketsServer[args[3]].send(WASD.pack('void', args[1], 'respond', 'Acknowledged')); 
                    }
                    else this.getSocketsServer(args[0])?.send(WASD.pack(
                        Object.keys(this.socketsServer).find(x => this.socketsServer[x] == ws), 
                        args[1], ...args.slice(2)));
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
module.exports.sendServer = (source, target, ...data) => {
    let id = this.getID().toString();
    if (typeof target == 'string') target = this.socketsServer[target];
    if (target?.readyState === 1) {
        if (waitList[target] && typeof data[data.length - 1] == 'function') {
            waitList[target][id] = data[data.length - 1];
            data = data.slice(0, -1);
        }
        if (source != 'twitch' && target == 'twitch') { data = ['[SYSTEM]', WASD.pack('!' + data[0], ...data.slice(1))]; }
        target.send(WASD.pack(source, id, ...data));
    }
}
module.exports.sendClient = (source, target, ...data) => {
    let id = this.getID().toString();
    let socket = typeof source == 'string' ? this.socketsClient[source] : source;
    let sourceID = typeof source == 'string' ? source : target;
    if (socket?.readyState === 1) {
        if (waitList[sourceID] && typeof data[data.length - 1] == 'function') {
            waitList[sourceID][id] = data[data.length - 1];
            data = data.slice(0, -1);
        }
        if (sourceID != 'twitch' && target == 'twitch') { data = ['[SYSTEM]', WASD.pack('!' + data[0], ...data.slice(1))]; }
        socket.send(WASD.pack(target, id, ...data));
    }
}
module.exports.onCommand = (key, cmds) => {
    return message => {
        args = WASD.unpack(message);
        if (args[2].toLowerCase() == 'respond') {
            if (waitList[key]?.[args[1]]) {
                console.log(`[API: ${args[1]}]`, 'Fulfilling Callback');
                waitList[key][args[1]](args.slice(3));
                delete waitList[key][args[1]];
            } // else console.warn(`[API: ${args[1]}]`, 'Callback is Missing, skipping');
        }
        else if (args[2].toLowerCase() == 'log') console.log(`[API: ${args[1]}]`, args.slice(3));
        else {
            //* send ${to} ${id} respond ${x}
            Object.values(cmds).filter(x => {
                if (typeof x.condition == 'string') 
                    return args[2].toLowerCase() === x.condition;
                else return x.condition(args.slice(2));
            }).map(_x => _x.execute(args.slice(2), message).then(x => {
                // this.log("cmd returned:", args[1], args[2], x);
                if (args[0].toLowerCase() == 'void' || x === undefined) {
                    delete waitList[args[0]]?.[args[1]];
                    return;
                }
                if (Array.isArray(x)) x = WASD.pack(x);
                else if (typeof x == 'object') x = JSON.stringify(x);
                this.getSocketsServer(args[0])?.send(WASD.pack(key, args[1], 'respond', x));
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
    files = (await listFiles(__dirname, 'data')).filter(x => x.endsWith('.json')).map(x => x.slice(0, -('.json'.length)));
    for (let p of files) {
        let t = traverse(data, p.split('/'));
        t[0][t[1]] = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', p + '.json')));
    }
    this.log(`Data Loaded onto Memory, read ${files.length} files, duration: ${measureEnd(m)}ms`);
    return data;
}
module.exports.writeData = (k, obj, force=false) => {
    if (typeof k === 'string') k = k.replace(/\[(\d+)\]/g, '.$1').split(/[\/\\\.]/g).map(x => !Number.isNaN(x) ? x : Number(x));
    let t = traverse(data, k);
    // check for identical (no writes needed)
    if ((typeof obj !== 'object' && t[0][t[1]] == obj) || (typeof obj === 'object' && JSON.stringify(t[0][t[1]]) == JSON.stringify(obj))) return t[0][t[1]];
    t[0][t[1]] = safeAssign(t[0][t[1]], obj);
    if (k[0] == 'user' && t[1] == 'point') require('../web/api_client/WS/screen')._sockets()[k[1]]?.ws.send(WASD.pack('points', obj));
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
    if (typeof k === 'string') k = k.replace(/\[(\d+)\]/g, '.$1').split(/[\/\\\.]/g).map(x => !Number.isNaN(x) ? x : Number(x));
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
        else if (fileExists(__dirname, '../../../secret/stream_info.json'))
            fs.rmSync(path.join(__dirname, '../../../secret/stream_info.json'));
    }
    if (this.getSocketsServer('twitch') != null) {
        const prodID = data.user?.[require('../twitch/include').id]?.['user-id'] ?? '140410053';
        let body = {};
        for (let k in o) switch (k) {
            case 'title':
                body.title = o.title;
                break;
            case 'category':
                try {
                    let catData = JSON.parse(await new Promise(resolve => { this.sendClient(this.ID, 'twitch', 'api', 'GET', `games?name=${o.category}`, resolve); }));
                    this.log('Found Twitch Category:', catData.data?.[0].id);
                    if (catData.data.length) body.game_id = catData.data[0].id
                } catch (e) { this.error(e); }
                break;
        }
        if (Object.keys(body).length) await new Promise(resolve => { this.sendClient(this.ID, 'twitch', 'api', 'PATCH', `channels?broadcaster_id=${prodID}`, JSON.stringify(body), resolve); });
    } else this.warn('updateLive() called without Twitch Module loaded');
    let obj = require('../model/include').sockets();
    if (obj._phase) obj._phase.send(WASD.pack('set', streamInfo.phase?.toString().padStart(2, '0')));
    if (obj._theme) obj._theme.send(WASD.pack('set', streamInfo.subject?.toString()));
}
module.exports.rejoinInfo = () => {
    if (!fileExists(__dirname, '../../../secret/stream_info.json')) {
        this.error("stream info does not exist??? (youre fucked)");
        return 1;
    }
    streamInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../secret/stream_info.json')));
    return 0;
}