const { src } = require("../..");

module.exports.execute = async () => {
    await src().reload.execute(() => {}, null, null, null, "!reload chat/chat", null, null);
    return [0, "done"];
}