const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { isNullish, safeAssign, takeWord } = require('../@main/util_client');
const { log, warn, error, onMessage, register, id, channel, commands } = require('./include');
let ws = undefined;
module.exports.init = (pw) => {
    require('./ws').init();
    return new Promise(resolve => {
        if (ws) ws.terminate();
        ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80');
        ws.on('open', () => { 
            log('Connected with IRC');
            require('../@main/features/reload').reload(path.join(__dirname, 'commands')).then(x => { if (!isNullish(x)) safeAssign(commands, x); });
            ws.send(`PASS oauth:${pw}`);
            ws.send(`NICK ${id}`);
            ws.send(`CAP REQ :twitch.tv/tags twitch.tv/commands`);
        });
        ws.on('message', raws => {
            raws.toString().trimEnd().split('\r\n').map(raw => {
                let { tag, src, cmd, msg } = parseMessage(raw);
                switch (cmd) {
                    case '001':
                        ws.send(`JOIN ${channel}`);
                        register(ws);
                        log('Connected with', channel);
                        log('Twitch Module Loaded');
                        resolve(0);
                        break;
                    case 'PRIVMSG':
                        {
                        let [_, message] = takeWord(msg).map(x => x.slice(1));
                        let user = src.slice(1, src.indexOf('!'));
                        onMessage(user, tag, message);
                        }
                        break;
                    case 'USERNOTICE':
                        {
                        let [_, subject] = takeWord(msg).map(x => x.slice(1));
                        let user = src.slice(1, src.indexOf('!'));
                        log("usernotice called:", tag, subject, user);
                        onMessage(user, tag, `!!${tag['msg-id']} ${subject}`);
                        }
                        break;
                    case 'PING':
                        ws.send(`PONG ${msg}`);
                        break;
                    case 'NOTICE': 
                        // copied directly lol
                        if ('Login authentication failed' === msg) {
                            log(`Authentication failed; left ${channel}`);
                            ws.send(`PART ${channel}`);
                        }
                        else if ('You don’t have permission to perform that action' === msg) {
                            log(`No permission. Check if the access token is still valid. Left ${channel}`);
                            ws.send(`PART ${channel}`);
                        }
                        break;
                    case 'PART':
                        log('Ending Comms')
                        ws.terminate();
                        ws = undefined;
                        register(undefined);
                        break;
                }
            });
        });
        ws.on('close', () => {
            warn('WebSocket Disconnected');
        });
    });
}

function parseMessage(raw) {
    let tag = {logged: true};
    let src = "";
    let cmd = "";
    let msg = "";
    let z = raw.split(' ');
    const INCLUDED_TAGS = ['badges', 'color', 'display-name', 'emotes', 'first-msg', 'id', 'user-id'];
    if (z[0].startsWith('@')) { for (let y of z[0].slice(1).split(';')) { x = y.split('='); if (INCLUDED_TAGS.includes(x[0])) tag[x[0]] = x[1]; } if (tag.badges) tag.badges = tag.badges.split(','); z = z.slice(1); }
    if (z[0].startsWith(':')) { src = z[0]; z = z.slice(1); }
    cmd = z[0]; msg = z.slice(1).join(' ')
    return {tag: tag, src: src, cmd: cmd, msg: msg};
}