const path = require('path');
const { exec } = require('child_process');
const { isNullOrWhitespace, WASD } = require('../../util_client');
const { ID, log, warn, error, getCategory, updateLive, sendClient, getSocketsServer } = require("../../include");
const { listFiles } = require('../../util_server');

module.exports.condition = 'startstream'
module.exports.execute = async args => {
    if (isNullOrWhitespace(args[1])) {
        log('PREPARING FOR STREAM');
        require('../../../model/commands/start').execute();
        sendClient(ID, 'obs', 'start', 'spawn');
        for (let fname of await listFiles(__dirname, '../../programs')) {
            log('Opening ' + fname);
            let f = exec(path.join(__dirname, '../../programs', fname));
            f.unref();
        }
    } else {
        log('========================');
        log('STARTING STREAM SEQUENCE');
        log('========================');
        if (isNullOrWhitespace(args[2])) args[2] = 'making [thing]';
        args[1] = getCategory(args[1]);
        let obj = {
            category: args[1],
            title: `🌟𝙋𝙕𝙋𝘿🌙 ${args[2]}`,
            subject: (args[2].match(/\[[^\]]+\]/)?.[0].slice(1, -1)) ?? 'gizmos',
            start: new Date().getTime(),
            phase: 0
        };
        await updateLive(obj);
        getSocketsServer('model')?.send(WASD.pack('twitch', 0, 'startingsoon'));
        sendClient(ID, 'discord', 'announce', isNullOrWhitespace(args[3]) ? args[2] : args[3]);
        sendClient(ID, 'obs', 'brb'); 
        sendClient(ID, 'obs', 'golive');
    }
    return 0;
}