const { send } = require("../..");
const { WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (user) => {
    log("GreenCircle Offline:", WASD.toString(user));
    send("web", "offline", WASD.toString(user));
    return [0, ""];
}