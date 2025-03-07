const { WASD } = require("../../common");
const { _send } = require("../WS/lala");

module.exports.execute = async (query, body) => {
    if (body.passphrase !== "notnotfoobar") return [200, {res: "no"}];
    delete body.passphrase;
    _send(WASD.pack(body));
    return [200, {res: 'hello lala'}];
}