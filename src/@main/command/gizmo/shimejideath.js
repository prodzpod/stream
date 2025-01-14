const { src, send, data } = require("../..")

module.exports.execute = async (author) => {
    let chatter = Object.values(data().user).find(x => x?.twitch?.name === author);
    if (chatter?.shimeji?.autorespawn ?? false) 
        await src().spawnShimeji.execute(() => {
            send("twitch", "send", null, "[🌙] respawned " + author, []);
        }, "", chatter, {}, "!guy", [], null);
    return [0, ""];
}