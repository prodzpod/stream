const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (id) => {
    let res = data().chungus.user[id] ?? {
        inventory: [],
        money: 0,
        select: [null, null, null]
    };
    res.id = id;
    res.name = data().user[id].twitch.name;
    res.profile = data().user[id].twitch.profile_image;
    return [0, res];
}
