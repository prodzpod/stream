const { log, warn, error, getCategory, updateLive, streamInfo } = require("../../include");
const { takeWord } = require('../../util_client');

module.exports.condition = 'marker'
module.exports.execute = async message => {
    log('==============');
    log('SETTING MARKER');
    log('==============');
    let info = streamInfo();
    if (!info.streaming) { warn('Stream is not on.'); return 0; }
    let [_, cat, title] = takeWord(message, 3);
    let obj = { phase: info.phase + 1 };
    if (isNullOrWhitespace(cat)) obj.cat = getCategory(cat);
    if (isNullOrWhitespace(title)) {
        obj.title = `🌟𝙋𝙕𝙋𝘿🌙 ${title}`;
        obj.subject = (title.match(/\[[^\]]+\]/)?.slice(1, -1)) ?? 'gizmos';
    }
    updateLive(obj);
    return 0;
}