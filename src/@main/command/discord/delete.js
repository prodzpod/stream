const { src, send } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = async id => {
    await src().chat.delete({discord: {id: id}});
    return [0, ""];
}