const { _online } = require("../api/WS/dex");

module.exports.execute = (user, stream) => {
    _online(user, stream);
    return [0, ""];
}