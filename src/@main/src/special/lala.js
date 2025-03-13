const { src, send, data } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!sendl";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    await fetch("https://prod.kr/api/lala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "passphrase": process.env.LALA_API_PASSWORD,
            "action": "message", 
            "userId": 1,
            "login": "prodzpod", 
            "name": "prod", 
            "badge": "broadcaster/1",
            "msgId": -1,
            "text": split(text, " ", 1)[1],
            "unescape": true,
            "emotes": "",
        })
    });
    return [0, split(text, " ", 1)[1]];
}