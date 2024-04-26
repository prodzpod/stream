const { send, log, warn, error } = require('../include');
module.exports.condition = ['!insts', '!instruments', '!instrument', '!inst']
module.exports.permission = true
module.exports.execute = async (_, user, data) => {
    send("current instruments: `sine`, `tri`, `sq50` and `drum`", user, data);
    return 0;
}