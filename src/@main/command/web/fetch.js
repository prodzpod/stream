const { src } = require("../..");

module.exports.execute = async (subject, user) => {
    return await src().screen.fetch(subject, user);
}