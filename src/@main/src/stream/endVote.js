const { src } = require("../..");

module.exports.predicate = ["!endvote", "!endpoll"];
module.exports.permission = 3;
module.exports.execute = (_reply) => {
    src().vote.endVote();
    return [0, ""];
}