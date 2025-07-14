const { send, src } = require("../..");
const { info, log } = require("../../commonServer");
const SHUTDOWN_OFFSET = [137, 420];
module.exports.predicate = "!joinvc";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    info("Joining VC");
    let w = src().windows.windows().discord.window;
    await send("raw", "send", `move ${w.x + SHUTDOWN_OFFSET[0]} ${w.y + SHUTDOWN_OFFSET[1]}`);
    await send("raw", "send", `dclick`);
    return [0, true];
}