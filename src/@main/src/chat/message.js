const { debug, log } = require("../../commonServer");

let messages = [];
module.exports.identify = message => {  
    const category = Object.keys(message).filter(x => x !== "fallback")[0];
    if (!category) return null;
    return messages.find(x => x[category].id == message[category].id) ?? null;
}
module.exports.register = message => {
    debug("Registering Message", message);
    messages.push(message);
}