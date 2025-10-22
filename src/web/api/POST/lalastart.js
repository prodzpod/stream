const { WASD } = require("../../common");
const { send } = require("../../ws");

module.exports.execute = async (query, body) => {
    if (body.passphrase !== process.env.LALA_API_PASSWORD) return [200, {res: "no"}];
    delete body.passphrase;
    send("chungusreset");
    return [200, {res: 'hello lala'}];
}