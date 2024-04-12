const { log, warn, error, getCategory, updateLive, streamInfo } = require("../../include");
const { isNullOrWhitespace } = require("../../util_client");

module.exports.condition = 'marker'
module.exports.execute = async args => {
    log('==============');
    log('SETTING MARKER');
    log('==============');
    let info = streamInfo();
    if (info.phase === -1) { warn('Stream is not on.'); return 0; }
    let obj = { phase: info.phase + 1 };
    if (!isNullOrWhitespace(args[1])) obj.category = getCategory(args[1]);
    if (!isNullOrWhitespace(args[2])) {
        obj.title = `🌟𝙋𝙕𝙋𝘿🌙 ${args[2]}`;
        obj.subject = (args[2].match(/\[[^\]]+\]/)?.[0].slice(1, -1)) ?? 'gizmos';
    }
    updateLive(obj);
    return 0;
}