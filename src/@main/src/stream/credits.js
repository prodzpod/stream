
const { data, src, send } = require("../..");
const { time, random } = require("../../common");
const { log } = require("../../commonServer");

module.exports.predicate = "!credits";
module.exports.permission = false;
module.exports.execute = async () => {
    log("Playing Credits");
    let raw = data().finale;
    let ret = {};
    for (let k in raw) {
        let titleAuthor = Object.values(data().user).find(x => x.twitch?.login === raw[k][1]);
        let descriptionAuthor = Object.values(data().user).find(x => x.twitch?.login === raw[k][3]);
        ret[k] = {
            T: raw[k][0],
            A: raw[k][1],
            C: titleAuthor?.twitch?.color ?? "#000000",
            I: titleAuthor?.economy?.icon?.icon ?? "common/" + random(data().icon.common),
            t: raw[k][2],
            a: raw[k][3],
            c: descriptionAuthor?.twitch?.color ?? "#000000",
            i: descriptionAuthor?.economy?.icon?.icon ?? "common/" + random(data().icon.common)
        }
    }
    await send("gizmo", "credits", JSON.stringify(ret));
    return [0, ""];
}