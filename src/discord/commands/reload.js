const { takeWord, safeAssign } = require('../../@main/util_client');
const { commands, log, warn, error } = require('../include');
module.exports.condition = 'reload'
module.exports.execute = async str => {
    let [_, k] = takeWord(str);
    let res = await require('../../@main/features/reload').reload([__dirname], k);
    if (res) safeAssign(commands, res);
    return 0;
}