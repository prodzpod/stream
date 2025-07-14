const { src } = require("../..");

module.exports.execute = (...args) => src().windows.execute(...args);