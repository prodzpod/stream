const WebSocket = require('ws')
const { isNullish, takeWord, safeAssign, encodeQuery, isNullOrWhitespace } = require('../@main/util_client');
const { reply, send } = require('../discord/include');
const fetch = require('node-fetch');
module.exports.channel = '#prodzpod';
module.exports.id = 'prodzpod'
module.exports.clientKey = 'g584kjzcj1tr15ouxg0fko2ybnckxh';
module.exports.ID = 'twitch';
module.exports.log = (...stuff) => console.log('[TWITCH]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[TWITCH]', ...stuff);
module.exports.error = (...stuff) => console.error('[TWITCH]', ...stuff);
let ws = undefined, eventsub = undefined;
let token = undefined;
module.exports.init = async (t) => { 
    token = t; 
    eventsub = new WebSocket('wss://eventsub.wss.twitch.tv/ws?keepalive_timeout_seconds=60');
    eventsub.on('message', str => {
        let req = JSON.parse(str.toString());
        require('./commands/events/' + req.metadata.message_type)?.execute(req);
    });
    return 0; 
};
module.exports.register = (w) => { ws = w; }
module.exports.onMessage = (user, tagReal, message) => {
    return new Promise(resolve => {
        let tag = {...tagReal};
        delete tag['first-msg']; delete tag.fromDiscord; delete tag.emotes;
        require('../@main/features/pipe/update_user').execute(`!!update_user ${user} ${JSON.stringify(tag)} ${message}`).then(data => {
            data = safeAssign(data, tagReal);
            Object.values(this.commands).filter(x => {
                if (typeof x.condition === 'string') {
                    let [k, _] = takeWord(message);
                    return k.toLowerCase() === x.condition;
                } else return x.condition(message, user, data);
            }).map(async cmd => {
                let perms = cmd.permission;
                if (perms === true || perms === false) perms = () => perms;
                if (Number(perms) === perms) switch (perms) {
                    case 0: perms = (_, __, d) => d.logged; break; // must be logged in
                    case 1: perms = (_, __, d) => d.mod; break;
                    case 2: perms = (_, __, d) => d.trusted; break;
                    case 3: perms = (_, __, d) => d.verified; break;
                }
                else if (String(perms) === perms) perms = [perms];
                else if (Array.isArray(perms)) perms = perms.includes(user);
                else perms = perms(message, user, data);
                if (this.id === user || perms) {
                    let ret = await cmd.execute(message, user, data);
                    if (ret !== undefined) resolve(ret);
                }
                else {
                    this.send("Insufficient Permission", user, data);
                    resolve(1);
                }
            });
        });
    });
    // foreach: check permission, then execute, then return result
}
module.exports.send = (msg, user, data) => { if (data.logged) return this.sendInternal(msg, (data.fromDiscord ? '#' : '') + (data.id ?? ('@' + user))); }
module.exports.sendInternal = (msg, user) => {
    if (ws === undefined) { this.warn("IRC Websocket is not open, message:", msg); return; }
    if (user.startsWith('#')) {
        user = user.slice(1);
        if (user.startsWith('@')) send(msg, user.slice(1));
        else reply(msg, user);
    } else {
        let txt;
        if (user.startsWith('@')) txt = `PRIVMSG ${this.channel} :[🌙] ${user} ${msg}`
        else if (!isNullish(user)) txt = `@reply-parent-msg-id=${user} PRIVMSG ${this.channel} :[🌙] ${msg}`
        else txt = `PRIVMSG ${this.channel} :[🌙] ${msg}`
        this._sendInternal(txt);
    }
    return msg;
}
module.exports._sendInternal = str => {
    if (ws === undefined) { this.warn("IRC Websocket is not open, message:", str); return; }
    ws.send(str);
}
module.exports.sendAPICall = async (method, subdir = '', query, body) => {
    let options = {
        method: method,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Client-Id': this.clientKey
        }
    };
    if (!['HEAD', 'GET'].includes(method) && body) options.body = body;
    try { return (await fetch('https://api.twitch.tv/helix/' + subdir + (isNullOrWhitespace(query) ? '?' : '') + encodeQuery(query), options)).json();
    } catch { return {}; };
}
module.exports.commands = {};