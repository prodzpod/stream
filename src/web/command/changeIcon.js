const { _changeIcon } = require("../api/WS/screen");

module.exports.execute = (chatter, msg) => {
    return [_changeIcon(chatter, msg), ""];
}