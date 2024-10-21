const { src } = require("../..");
const { args } = require("../chat/chat");

module.exports.predicate = ["!endprediction", "!endgamble", "!endgamba", "!endpredictions", "!endbet"];
module.exports.permission = 3;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    src().prediction.endPrediction(_reply, args(text)[0]);
}