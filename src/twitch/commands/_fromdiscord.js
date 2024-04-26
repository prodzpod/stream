const { ID, _sendInternal, channel, log, warn, error } = require('../include');
const { data, sendClient } = require('../../@main/include');
module.exports.condition = '!!discord'
module.exports.permission = false
module.exports.execute = async (args, __, ___) => {
    let tags = data().user[args[1]] ?? {};
    args[2] = args[2].replace(/\s+/g, " ");
    if (args[1].length + ": ".length + args[2].length <= 500) 
        _sendInternal(`PRIVMSG ${channel} :${args[1]}: ${args[2]}`);
    else {
        let len = 500 - (args[1].length + ": ".length + " (X/9)".length);
        let txts = [], txt = args[2];
        while (txt.length > len) {
            let idx = txt.slice(0, len).lastIndexOf(" ");
            if (idx == -1) idx = len;
            txts.push(txt.slice(0, idx));
            txt = txt.slice(idx);
        }
        txts.push(txt);
        let part = "?";
        if (txts.length < 10) part = txts.length.toString();
        for (let i = 0; i < txts.length; i++) 
            _sendInternal(`PRIVMSG ${channel} :${args[1]}: ${txts[i]} (${i + 1}/${part})`);
    }
    sendClient(ID, "main", "chat", args[1], args[2], tags.color ?? '#000000');
    return 0;
}