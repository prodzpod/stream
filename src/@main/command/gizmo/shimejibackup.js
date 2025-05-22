const { src, send, data } = require("../..")

module.exports.execute = async (x, y, angle, author) => {
    let chatter = Object.values(data().user).find(x => x?.twitch?.name === author);
    if (chatter?.shimeji) await src().spawnShimeji.execute(() => {}, "", chatter, {}, `!guy ${x} ${y}`, [], null);
    return [0, ""];
}