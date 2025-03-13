const { WASD } = require("../../common");
const { _send } = require("../WS/lala");

module.exports.execute = async (query, body) => {
    if (body.passphrase !== process.env.LALA_API_PASSWORD) return [200, {res: "no"}];
    delete body.passphrase;
    _send(WASD.pack(body));
    return [200, {res: 'hello lala'}];
}