const { send, log } = require("../../ws");

module.exports.execute = async (query, body) => {
    log(query, body);
    return [200, "done"];
}