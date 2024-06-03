const { _info } = require("../api/WS/screen");
const { log } = require("../ws");

module.exports.execute = (chatter, msg) => {
    log(chatter, msg);
    return [_info(chatter, msg), ""];
}