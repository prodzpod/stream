const WebSocket = require('ws');
const path = require('path');
const { isNullish, safeAssign, encodeQuery, isNullOrWhitespace, WASD } = require('../@main/util_client');
const { reply, send } = require('../discord/include');
const fetch = require('node-fetch');
const { fileExists } = require('../@main/util_server');
const { sendClient } = require('../@main/include');
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
    if (await this.validate()) {
        if (eventsub) eventsub.terminate();
        let subs = await this.sendAPICall("GET", "eventsub/subscriptions", {}, {});
        for (let d of subs.data) if (d.status === 'enabled') await this.sendAPICall("DELETE", "eventsub/subscriptions", {id: d.id}, {});
        eventsub = new WebSocket('wss://eventsub.wss.twitch.tv/ws');
        eventsub.on('message', str => {
            let req = JSON.parse(str.toString());
            let cmd = req.metadata.message_type;
            if (cmd == 'notification') cmd = req.metadata.subscription_type.replace(/\./g, "_");
            if (fileExists(path.join(__dirname, `commands/_events/${cmd}.js`)))
                require('./commands/_events/' + cmd).execute(req);
        });
        eventsub.on('close', e => {
            this.warn("eventsub Websocket closed???");
            this.warn(e);
        });
    } else {
        this.log("OAuth Outdatad, Restarting Twitch");
        require('./commands/base/restart').execute();
    }
    return 0; 
};
module.exports.register = (w) => { ws = w; }
module.exports.onMessage = (user, tagReal, message) => {
    let args = WASD.unpack(message);
    return new Promise(resolve => {
        let tag = {...tagReal};
        for (let k of ['first-msg', 'emotes', 'fromDiscord', 'msg-id', 'msg-param-cumulative-months', 'msg-param-displayName', 'msg-param-login', 'msg-param-months', 'msg-param-promo-gift-total', 'msg-param-promo-name', 'msg-param-recipient-display-name', 'msg-param-recipient-id', 'msg-param-recipient-user-name', 'msg-param-sender-login', 'msg-param-sender-name', 'msg-param-should-share-streak', 'msg-param-streak-months', 'msg-param-sub-plan', 'msg-param-sub-plan-name', 'msg-param-viewerCount', 'msg-param-ritual-name', 'msg-param-threshold', 'msg-param-gift-months']) delete tag[k];
        sendClient(this.ID, 'main', 'update_user', user, JSON.stringify(tag), ...args, data => {
            // this.log("include:", JSON.parse(data));
            data = safeAssign(JSON.parse(data), tagReal);
            Object.values(this.commands).filter(x => {
                if (typeof x.condition === 'string')
                    return args[0].toLowerCase() === x.condition;
                else if (Array.isArray(x.condition)) return x.condition.some(y => args[0].toLowerCase() === y);
                else return x.condition(args, user, data);
            }).map(async cmd => {
                let perms = cmd.permission;
                switch (typeof perms) {
                    case 'string':
                        perms = [perms];
                    case 'object':
                        if (!Array.isArray(perms)) perms = Object.values(perms);
                        perms = perms.includes(user);
                        break;
                    case 'number':
                        switch (perms) {
                            case 0: perms = (_, __, d) => d.logged; break; // must be logged in
                            case 1: perms = (_, __, d) => d.mod; break;
                            case 2: perms = (_, __, d) => d.trusted; break;
                            case 3: perms = (_, __, d) => d.verified; break;
                        }
                    case 'function':
                        perms = perms(args, user, data);   
                        break;
                }
                if (user.startsWith("#")) user = user.slice(1);
                if (user === this.id || user === '[SYSTEM]' || perms) {
                    let ret = await cmd.execute(args, user, data, message);
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
    if (user === '@[SYSTEM]') { this.log("output:", msg); return; }
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
        mode: 'cors',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Client-Id': this.clientKey,
            'Content-Type': 'application/json'
        }
    };
    if (!subdir.startsWith("https://") && !subdir.startsWith("http://")) subdir = 'https://api.twitch.tv/helix/' + subdir;
    if (!['HEAD', 'GET'].includes(method) && body) options.body = JSON.stringify(body);
    try { return await (await fetch(subdir + (isNullOrWhitespace(query) ? '' : '?') + encodeQuery(query), options)).json(); } 
    catch { return {}; };
}
module.exports.validate = async () => {
    this.log("Validation Started");
    try {
        let z = (await (await fetch('https://id.twitch.tv/oauth2/validate', { method: 'GET', headers: { 'Authorization': 'OAuth ' + token, 'Client-Id': this.clientKey, 'Content-Type': 'application/json' } })).json())
        return z.status != 401;
    } catch { return false; }
}
module.exports.commands = {};