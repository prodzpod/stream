const { send, src, data } = require("../..");
const { nullish, trueish } = require("../../common");
const { info, log } = require("../../commonServer");
const { initialize } = require("../chat/user");

module.exports.predicate = "!startweekly";
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    module.exports.start();
    return [0, ""];
}

let loop = null;
const MINUTELY_IU = 40;

async function check() {
    if (data().stream.phase === -1) { log("Ending Weekly Take"); return; } 
    log("User Check Started");
    let users = await send("twitch", "users", 140410053);
    if (trueish(users) === false) return;
    for (let id of users) {
        chatter = await initialize(id);
        if (chatter?.twitch.id) data(`user.${chatter.twitch.id}.economy.iu`, Number(chatter.economy.iu) + MINUTELY_IU);
        if (chatter?.shimeji?.ai) {
            chatter.shimeji.ai.dexterity.max += 1;
        }
    }
    log("User Check Finished, Users: ", users.join(", "));
    data("stream.users", users);
    setTimeout(check, 5*60000);
}

module.exports.start = async () => {
    log("Starting Weekly Take");
    if (!loop) clearTimeout(loop);
    await check();
    loop = setTimeout(check, 5*60000);
}

module.exports.end = () => {
    if (!loop) clearTimeout(loop);
    data("stream.users", []);
}