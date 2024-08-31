const { src } = require("../..");

module.exports.execute = async () => {
    return [0, (await src().screen.updateGCP())[1]];
}