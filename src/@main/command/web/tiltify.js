const { src, send } = require("../..");
const { nullish, random } = require("../../common");
const { path, log, info } = require("../../commonServer");
module.exports.execute = async (name, value, currency, comment) => {
    let profile = path("src/@main/data/user/0.twitch.png");
    let chatter = await src().user.initialize(name);
    if (name !== "Anonymous" && nullish(chatter?.twitch?.name)) {
        name = chatter.twitch.name;
        profile = chatter.twitch.profile;
    }
    comment ??= "FOR THE KIDS!!!!!!";
    info("Donate Submitted:", name, profile, value, currency, comment);
    send("web", "jake", random(["item", "enemy", "enemy", "enemy"]));
    return [0, ""];
}