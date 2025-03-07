const { data } = require("../..");
const { log } = require("../../commonServer");

module.exports.predicate = ["!big", "!bigmode", "!huge", "!massive", "!spacious", "!vainglorious", "!enceinte", "!elephantine"];
module.exports.permission = (from, chatter) => { log(chatter); return chatter?.twitch?.id === 175334432; } // caram3lnuke
module.exports.execute = async (_reply, from, chatter) => {
    let big = chatter.shimeji.override === "$NAME$_big";
    data("user.175334432.shimeji.override", big ? "$NAME$" : "$NAME$_big");
    _reply(big ? "small achieved" : "big achieved");
    return [0, !big];
}