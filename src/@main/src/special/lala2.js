const { src, send, data } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!execl";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    await fetch("https://prod.kr/api/lala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "passphrase": process.env.LALA_API_PASSWORD,
            "action": "exec", 
            "userId": 1,
            "login": "prodzpod", 
            "name": "prod", 
            "badge": "broadcaster/1",
            "data": "all = q('.message-content-box'); last = q('.message-content-box')[0]; all.map(x => x.style.transition = 'all 1s'); " + split(text, " ", 1)[1]
        })
    });
    return [0, split(text, " ", 1)[1]];
}