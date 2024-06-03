const { log } = require("../../commonServer")

module.exports.execute = (id, name) => {
    log("shoutout recieved:", name, id);
    return [0, ""];
}