const { src, send, data, incrementData } = require("../..");
const { nullish, random, numberish } = require("../../common");
const { path, log, info } = require("../../commonServer");
module.exports.execute = async (name, value, currency, comment) => {
    let profile = path("src/@main/data/user/0.twitch.png");
    let chatter = await src().user.initialize(name);
    if (name !== "Anonymous" && nullish(chatter?.twitch?.name)) {
        name = chatter.twitch.name;
        profile = chatter.twitch.profile;
    }
    comment ??= "FOR THE america!!!!!!";
    info("Donate Submitted:", name, profile, value, currency, comment);
    let res;
    while (!res || res === "Process is currently busy. try again later") { // donation should not be ignored
        res = await new Promise(resolve => src().CElink.sendce(resolve, `valueRandom ${Math.floor(numberish(value) * 100)}`));
    }
    send("gizmo", "charity2", res.split("\n").map(x => numberish(x).toString(16).padStart(8, "0")).join("\n"));
    send("gizmo", "charity", name, profile, value, currency, comment);
    incrementData(`user.140410053.special.vice`, value);
    let vice = data().user[140410053].special.vice;
    let vicemax = data().user[140410053].special.vicemax;
    if (vice > vicemax) {
        data(`user.140410053.special.vicemax`, vicemax * 2);
        vicemax *= 2;
    }
    send("gizmo", "updateprogress", "vice", "< !charity > for details", "this is a charity event for VTubers Against ICE ! all proceedings will go to ACLU (American Civil Liberties Union) . whenever we reach a goal it will be doubled and ill come up with a random event", vicemax, vice);
    return [0, ""];
}