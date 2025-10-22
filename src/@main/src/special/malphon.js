const { src, send, data } = require("../..");
const { args } = require("../chat/chat");
module.exports.predicate = "!execss";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    send("web", "ws", "malphon", "exec", args(text)[0]);
    _reply("done!");
    return [0, args(text)[0]];
}

module.exports.addTilly = async () => {
    let tillies = data().user[1070508385].special.tillies + 1;
    data("user.1070508385.special.tillies", tillies);
    send("web", "ws", "malphon", "settillies", tillies);
}
module.exports.removeTilly = async () => {
    let tillies = data().user[1070508385].special.tillies - 1;
    data("user.1070508385.special.tillies", tillies);
    send("web", "ws", "malphon", "settillies", tillies);
}