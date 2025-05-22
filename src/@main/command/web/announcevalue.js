const { send, src } = require("../..");
module.exports.execute = async () => {
    return await src().announcevalue.execute(() => {});
}