const { src } = require("../..");

module.exports.execute = async (id, text) => {
    return await src().chat.message("web", { twitch: { id: id }}, {}, text, null);
}