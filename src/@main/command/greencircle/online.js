const { send } = require("../..");
const { WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (user) => {
    log("GreenCircle Online:", user);
    let stream = await send("twitch", "stream", WASD.toString(user));
    if (!stream) return await require("./offline").execute(user);
    if (user !== "prodzpod") {
        let announcement_mini = `[🌙] GreenFeed 🟢 ${stream?.user_name ?? user} has started a ${stream?.game_name ?? ""} stream, check it out at https://twitch.tv/${user} !`;
        let announcement_full = `<@&1270494916325277727>\n[🟢] **${stream?.user_name ?? user}** has started a **${stream?.game_name ?? ""}** stream, come hang out!\nhttps://twitch.tv/${user}`;
        await send("twitch", "send", "140410053", announcement_mini, []);
        await send("discord", "send", "1270496759545593927", announcement_full, []);
        let msg = await send("discord", "send", "1219954701726912586", announcement_mini, []);
        await send("discord", "delete", msg.id, msg.channel);
    }
    send("web", "online", WASD.toString(user), stream);
    return [0, ""];
}