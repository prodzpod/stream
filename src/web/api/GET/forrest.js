const { send, log } = require("../../ws");

module.exports.execute = async (query, body) => {
    if (query.passphrase !== process.env.FORREST_API_PASSWORD) return [403, {res: "no!!!!!!!!!"}];
    send("click", query.id, query.x, query.y);
    return [200, {res: "hello forrest"}];
}