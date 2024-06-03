const { send } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = (txt) => {
    log("clonkchat recieved:", txt);
    if (txt === "JoelCheck") send("twitch", "send", "866686220", "[🌙] JoelCheck RECIEVE");
    return [0, ""];
}