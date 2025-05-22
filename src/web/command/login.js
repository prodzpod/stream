const { _linkProd } = require("../api/WS/clip");
const { _login } = require("../api/WS/screen");
const { log } = require("../ws");

module.exports.execute = async (k, chatter, hash, category, streaming = false) => {
    switch (category) {
        case "clip":
            if (chatter.isProd) await _linkProd(k, chatter, hash);
            break;
        default:
            await require("../api/WS/" + category)._login(k, chatter, hash, streaming);
            break;
    }
    return [0, ""];
}