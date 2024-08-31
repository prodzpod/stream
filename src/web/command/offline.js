const { _offline } = require("../api/WS/dex");

module.exports.execute = (user) => {
    _offline(user);
    return [0, ""];
}