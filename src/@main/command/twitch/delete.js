const { src, send } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = async id => {
    await src().chat.delete({twitch: {id: id}});
    return [0, ""];
}