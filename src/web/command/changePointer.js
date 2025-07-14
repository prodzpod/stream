const { _changePointer } = require("../api/WS/screen");

module.exports.execute = (chatter, msg, msg2) => {
    return [_changePointer(chatter, msg, msg2), ""];
}