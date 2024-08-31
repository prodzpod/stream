const { debug, log } = require("../../commonServer");

let messages = [];
module.exports.identify = message => {  
    const category = Object.keys(message).filter(x => x !== "fallback")[0];
    if (!category) return null;
    return messages.find(x => x[category]?.id == message[category]?.id) ?? null;
}
module.exports.register = (message, chatter) => {
    debug("Registering Message", message);
    message.chatter = chatter;
    messages.push(message);
}
module.exports.delete = (message) => {
    messages = messages.filter(x => x.twitch?.id !== message.twitch?.id);
}
module.exports.messages = () => messages;