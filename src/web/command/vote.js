const { _sendAll } = require("../api/WS/screen");

module.exports.execute = async (title, options) => {
    _sendAll("voteStart", title, options);
    return [0, ""];
}