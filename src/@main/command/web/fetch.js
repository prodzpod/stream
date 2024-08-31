const { src } = require("../..");

module.exports.execute = subject => {
    return src().screen.fetch(subject);
}