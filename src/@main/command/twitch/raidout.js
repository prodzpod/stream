const { send, src } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = (id, name) => {
    log("raidout recieved:", name, id);
    src().endStream.execute();
    return [0, ""];
}