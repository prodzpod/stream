const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async () => {
    const USERS = data().chungus.user;
    for (let k in USERS) {
        if (!USERS[k].watered[0]) continue;
        USERS[k].watered[0] = false;
    }
    data("chungus", {user: USERS});
    return [0, ""];
}