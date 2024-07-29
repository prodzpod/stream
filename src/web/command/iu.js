const { _iu } = require("../api/WS/screen");

module.exports.execute = (chatter, msg) => {
    return [_iu(chatter, msg), ""];
}