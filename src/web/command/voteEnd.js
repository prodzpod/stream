const { _sendAll } = require("../api/WS/screen");

module.exports.execute = async (result) => {
    _sendAll("voteEnd", result);
    return [0, ""];
}