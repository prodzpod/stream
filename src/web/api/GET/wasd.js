const { WASD } = require("../../common");
const { log } = require("../../ws");

module.exports.execute = async (query, body) => {
    switch (query.action) {
        case "pack":
            try { 
                query.text = JSON.parse(query.text);
                return [200, WASD.pack(query.text)];
            } catch { return [400, "invalid json"]; }
        case "unpack":
            return [200, JSON.stringify(WASD.unpack(query.text))];
        default:
            return [400, "invalid action"];
    }
}