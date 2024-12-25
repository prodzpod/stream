const { log, info } = require("../../commonServer")

module.exports.execute = (id, name) => {
    info("shoutout recieved:", name, id);
    return [0, ""];
}