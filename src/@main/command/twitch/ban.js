const { src, send } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = async id => {
    log("ban recieved:", id);
    for (let m of src().message.messages().filter(x => x.chatter.twitch.id === id))
        await src().chat.delete({twitch: {id: m.twitch.id}});
    return [0, ""];
}