const { log } = require("../../commonServer")

module.exports.execute = (id, name) => {
    log("follow recieved:", name, id);
    return [0, ""];
}