const { src } = require("../..");

module.exports.execute = async (id, text) => {
    const chatter = id === -1 ? {} : { twitch: { id: id }};
    return [0, await src().chat.message("web", chatter, {}, text, [], null)];
}