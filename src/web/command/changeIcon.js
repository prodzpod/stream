const { _changeIcon } = require("../api/WS/screen");

module.exports.execute = (chatter, msg, msg2) => {
    return [_changeIcon(chatter, msg, msg2), ""];
}