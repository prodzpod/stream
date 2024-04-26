const fs = require('fs');
const path = require('path');
const { log, warn, error, sendClient, updateLive, ID } = require("../../include");
const { listFiles } = require('../../util_server');

module.exports.condition = 'endstream'
module.exports.execute = async _ => {
    log('======================');
    log('ENDING STREAM SEQUENCE');
    log('======================');
    updateLive({
        title: '🌟𝙋𝙕𝙋𝘿🌙 Currently Offline',
        subject: null,
        category: 'Software and Game Development',
        start: -1,
        phase: -1
    });
    require('../../../model/commands/end').execute();
    sendClient(ID, 'obs', 'endstream');
    let songs = (await listFiles(__dirname, '../../data/song')).filter(x => x.startsWith("_"));
    log("Removing", songs.length, "song files");
    for (let song of songs) fs.rm(path.join(__dirname, '../../data/song', song));
    return 0;
}