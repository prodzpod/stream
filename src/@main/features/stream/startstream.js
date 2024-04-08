const { isNullOrWhitespace, takeWord } = require('../../util_client');
const { ID, log, warn, error, getCategory, updateLive, sendClient } = require("../../include");

module.exports.condition = 'startstream'
module.exports.execute = async message => {
    log('========================');
    log('STARTING STREAM SEQUENCE');
    log('========================');
    let [_, cat, title] = takeWord(message, 3);
    if (isNullOrWhitespace(title)) title = 'making [thing]';
    cat = getCategory(cat);
    let obj = {
        category: cat,
        title: `🌟𝙋𝙕𝙋𝘿🌙 ${title}`,
        subject: (title.match(/\[[^\]]+\]/)?.slice(1, -1)) ?? 'gizmos',
        start: new Date().getTime(),
        phase: 0
    };
    updateLive(obj);
    require('../../../model/commands/start').execute();
    sendClient(ID, 'obs', 'start');
    return 0;
}