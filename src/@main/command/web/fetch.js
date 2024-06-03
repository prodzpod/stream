const { data, src } = require("../..");
const { log } = require("../../commonServer");

module.exports.execute = subject => {
    return src().screen.fetch(subject);
}